import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { googleConfig } from './google';

// Type alias to help with type checking for crypto operations
type CryptoKey = any;

interface AuthResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
    id_token: string;
}

interface EncryptionService {
    encrypt(text: string): EncryptedToken;
    decrypt(encryptedText: EncryptedToken): string;
}

export interface EncryptedToken {
    iv: string;
    encrypted: string;
    authTag: string;
}

interface UserInfo {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
}

// lib/services/googleAuthService.ts

/**
 * Authenticate a user with a Google authorization code
 */
export class GoogleAuthService {
    private oauth2Client: any;
    private authClient: OAuth2Client;
    private encryptionService: EncryptionService;
    private readonly algorithm = 'aes-256-gcm';
    private readonly encryptionKey: CryptoKey;

    constructor(encryptionService: EncryptionService) {
        this.oauth2Client = new google.auth.OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirectUri
        );
        console.log('OAuth2 client initialized with:', {
            clientId: googleConfig.clientId,
            redirectUri: googleConfig.redirectUri,
            scopes: googleConfig.scopes
            // Important: clientSecret is intentionally not logged for security
        });
        this.authClient = new OAuth2Client(googleConfig.clientId);
        this.encryptionService = encryptionService;

        if (!process.env.ENCRYPTION_KEY) {
            throw new Error('ENCRYPTION_KEY must be defined');
        }
        this.encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex') as unknown as CryptoKey;
    }

    async encryptRefreshToken(refreshToken: string): Promise<string> {
        console.log('--> Encrypting refresh token:', refreshToken);

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            this.algorithm,
            this.encryptionKey as any,
            iv as any
        );

        let encrypted = cipher.update(refreshToken, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        const encryptedToken: EncryptedToken = {
            iv: iv.toString('hex'),
            encrypted,
            authTag: authTag.toString('hex')
        };

        const result = JSON.stringify(encryptedToken);
        console.log('--> Encrypted result:', result);

        return result;
    }

    async authenticateUser(code: string): Promise<AuthResponse> {
        const url = 'https://www.googleapis.com/oauth2/v4/token';
        const params = new URLSearchParams({
            code,
            client_id: googleConfig.clientId,
            client_secret: googleConfig.clientSecret,
            redirect_uri: googleConfig.redirectUri,
            grant_type: 'authorization_code'
        });

        try {
            console.log('Making OAuth token request to Google API');
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            if (!resp.ok) {
                console.error('OAuth API Call Error:', resp.status, resp.statusText);
                const errorData = await resp.json().catch(() => ({}));
                console.error('Error response data:', errorData);
                throw new Error(`Failed to authenticate user: ${resp.status} ${resp.statusText}`);
            }

            const data = await resp.json() as AuthResponse;

            // Log successful authentication without sensitive information
            console.log('OAuth response received:', {
                token_type: data.token_type,
                expires_in: data.expires_in,
                scope: data.scope,
                has_refresh_token: !!data.refresh_token,
                access_token_length: data.access_token?.length || 0
            });

            return data;
        } catch (error) {
            console.error('OAuth API Call Error:', error);
            throw new Error('Failed to authenticate user');
        }
    }

    async renewAccessToken(encryptedRefreshToken: string): Promise<AuthResponse> {
        const url = 'https://oauth2.googleapis.com/token';

        try {
            console.log('[renewAccessToken] START: Beginning token renewal process');
            console.log('[renewAccessToken] Refresh token length:', encryptedRefreshToken?.length || 0);

            // Parse the JSON string into EncryptedToken
            console.log('[renewAccessToken] Attempting to decrypt refresh token');
            let decryptionSuccessful = false;
            let refreshTokenToUse = encryptedRefreshToken;

            console.log('[renewAccessToken] Checking if token is JSON-parseable (encrypted)');
            try {
                // Try to parse as JSON
                const parsedToken = JSON.parse(encryptedRefreshToken);
                console.log('[renewAccessToken] Token is in JSON format:', !!parsedToken);

                if (parsedToken.iv && parsedToken.encrypted && parsedToken.authTag) {
                    console.log('[renewAccessToken] Token appears to be encrypted, attempting decryption');
                    try {
                        // Create decipher with parsed components
                        const decipher = crypto.createDecipheriv(
                            this.algorithm,
                            this.encryptionKey as any,
                            Buffer.from(parsedToken.iv, 'hex') as any
                        );

                        decipher.setAuthTag(Buffer.from(parsedToken.authTag, 'hex') as any);

                        let decryptedRefreshToken = decipher.update(
                            parsedToken.encrypted,
                            'hex',
                            'utf8'
                        );
                        decryptedRefreshToken += decipher.final('utf8');

                        console.log('[renewAccessToken] Decryption successful, decrypted token length:', decryptedRefreshToken.length);
                        refreshTokenToUse = decryptedRefreshToken;
                        decryptionSuccessful = true;
                    } catch (decryptError) {
                        console.error('[renewAccessToken] Decryption error:', decryptError);
                    }
                }
            } catch (parseError) {
                console.log('[renewAccessToken] Token is not in JSON format, using as-is');
            }

            if (!decryptionSuccessful) {
                console.log('[renewAccessToken] Using token as-is (not encrypted or decryption failed)');
            }

            console.log('[renewAccessToken] Preparing request to Google OAuth endpoint');
            const params = new URLSearchParams({
                client_id: googleConfig.clientId,
                client_secret: googleConfig.clientSecret,
                grant_type: 'refresh_token',
                refresh_token: refreshTokenToUse
            });

            console.log('[renewAccessToken] Making request to Google OAuth endpoint with:');
            console.log('[renewAccessToken] - client_id:', googleConfig.clientId);
            console.log('[renewAccessToken] - grant_type: refresh_token');
            console.log('[renewAccessToken] - token (first 10 chars):', refreshTokenToUse.substring(0, 10) + '...');
            // Note: Intentionally not logging client_secret for security

            console.log('[renewAccessToken] Sending request to:', url);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            if (!response.ok) {
                console.error('[renewAccessToken] Fetch error details:', response.statusText);
                console.error('[renewAccessToken] Error response status:', response.status);
                const errorData = await response.json().catch(() => ({}));
                console.error('[renewAccessToken] Error response data:', errorData);
                throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
            }

            const data = await response.json() as AuthResponse;

            console.log('[renewAccessToken] Received response from Google OAuth endpoint');
            console.log('[renewAccessToken] Response status:', response.status);
            console.log('[renewAccessToken] Access token received (length):', data.access_token?.length || 0);
            console.log('[renewAccessToken] Token type:', data.token_type);
            console.log('[renewAccessToken] Expires in:', data.expires_in);

            console.log('[renewAccessToken] END: Token renewal process completed successfully');
            return data;
        } catch (error) {
            console.error('[renewAccessToken] ERROR: OAuth API Call Error:', error);
            throw new Error(`Failed to refresh access token: ${error}`);
        }
    }

    // Alias for backward compatibility
    async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
        console.log('[refreshAccessToken] Called, delegating to renewAccessToken');
        console.log('[refreshAccessToken] Input token (length):', refreshToken?.length || 0);

        try {
            const result = await this.renewAccessToken(refreshToken);
            console.log('[refreshAccessToken] Successfully renewed token');
            return result;
        } catch (error) {
            console.error('[refreshAccessToken] Error renewing token:', error);
            throw error;
        }
    }

    async verifyAndGetUserInfo(idToken: string): Promise<UserInfo> {
        try {
            const ticket = await this.authClient.verifyIdToken({
                idToken,
                audience: googleConfig.clientId
            });
            return ticket.getPayload() as UserInfo;
        } catch (error) {
            console.error('Token verification error:', error);
            throw new Error('Failed to verify token');
        }
    }
}
