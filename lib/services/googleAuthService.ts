import { GoogleTokenResponse, GoogleUserInfo, EncryptedToken } from '../types/auth';

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
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;
    private readonly tokenEndpoint = 'https://oauth2.googleapis.com/token';
    private readonly userInfoEndpoint = 'https://www.googleapis.com/oauth2/v1/userinfo';
    private encryptionService?: EncryptionService;

    constructor(encryptionService?: EncryptionService) {
        // Validate required env variables
        if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
            throw new Error('GOOGLE_CLIENT_ID environment variable is required');
        }
        if (!process.env.GOOGLE_CLIENT_SECRET) {
            throw new Error('GOOGLE_CLIENT_SECRET environment variable is required');
        }
        if (!process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI) {
            throw new Error('NEXT_PUBLIC_GOOGLE_REDIRECT_URI environment variable is required');
        }

        this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        this.redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
        this.encryptionService = encryptionService;
    }

    /**
     * Legacy method used by route handlers
     */
    public async authenticateUser(code: string): Promise<AuthResponse> {
        console.log('Authenticating user with code...');
        const tokens = await this.getTokensFromCode(code);

        return {
            access_token: tokens.access_token,
            expires_in: tokens.expires_in,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type,
            id_token: tokens.id_token || ''
        };
    }

    /**
     * Encrypt a refresh token
     */
    public async encryptRefreshToken(refreshToken: string): Promise<string> {
        if (!this.encryptionService) {
            console.log('No encryption service provided, storing token as is');
            return refreshToken;
        }

        console.log('Encrypting refresh token');
        const encryptedToken = this.encryptionService.encrypt(refreshToken);
        return JSON.stringify(encryptedToken);
    }

    /**
     * Verify and decode ID token
     */
    public async verifyAndGetUserInfo(idToken: string): Promise<UserInfo> {
        console.log('Verifying ID token...');
        // In a real implementation, we would verify the token signature

        // For now, just decode the payload part of the JWT
        const parts = idToken.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid ID token format');
        }

        try {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            return {
                sub: payload.sub,
                email: payload.email,
                email_verified: payload.email_verified,
                name: payload.name,
                picture: payload.picture
            };
        } catch (error) {
            console.error('Error decoding ID token:', error);
            throw new Error('Failed to decode ID token');
        }
    }

    /**
     * Exchange authorization code for tokens
     */
    public async getTokensFromCode(code: string): Promise<GoogleTokenResponse> {
        console.log(`Exchanging code for tokens...`);

        const params = new URLSearchParams({
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            grant_type: 'authorization_code'
        });

        try {
            const response = await fetch(this.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Google token exchange error:', errorText);
                throw new Error(`Failed to exchange code: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            return data as GoogleTokenResponse;
        } catch (error) {
            console.error('Error exchanging code for tokens:', error);
            throw error;
        }
    }

    /**
     * Refresh access token using refresh token
     */
    public async refreshAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
        console.log('Refreshing access token...');

        const params = new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        });

        try {
            const response = await fetch(this.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Token refresh error:', errorText);
                throw new Error(`Failed to refresh token: ${response.status} ${errorText}`);
            }

            return await response.json() as GoogleTokenResponse;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }

    /**
     * Get user info using access token
     */
    public async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
        console.log('Getting user info...');

        try {
            const response = await fetch(`${this.userInfoEndpoint}?access_token=${accessToken}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('User info error:', errorText);
                throw new Error(`Failed to get user info: ${response.status} ${errorText}`);
            }

            return await response.json() as GoogleUserInfo;
        } catch (error) {
            console.error('Error getting user info:', error);
            throw error;
        }
    }
}
