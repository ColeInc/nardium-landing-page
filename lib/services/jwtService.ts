// lib/services/jwtService.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtVerify } from 'jose'; // Edge-compatible JWT library


export interface JWTPayload {
    user_id: string;
    email: string;
    subscription_tier?: 'free' | 'premium' | 'subscriber';
    sessionId: string;
    sub?: string;
    iat?: number;
    exp?: number;
}


interface CookieConfig {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    maxAge?: number;
}

export class JwtService {
    private JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
    private isProd = process.env.NODE_ENV === 'production';
    private secretKey: Uint8Array;

    constructor() {
        // Convert string secret to Uint8Array for Edge compatibility
        this.secretKey = new TextEncoder().encode(this.JWT_SECRET);
    }

    /**
     * Create a session JWT token
     */
    createSessionToken(payload: {
        user_id: string;
        email: string;
        sessionId: string;
        subscription_tier: string;
    }): string {
        // Implementation would use a JWT library to create a token
        console.log('Creating JWT token for user:', payload.user_id);

        return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '24h' });
    }

    /**
     * Verify and decode a JWT token
     */
    verifyToken(token: string): JwtPayload | string {
        // Use jsonwebtoken in Node.js environments
        if (typeof window === 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
            return jwt.verify(token, this.JWT_SECRET);
        }

        // If in Edge runtime, we need to throw an error since we can't verify here
        // This will be handled by the verifyTokenEdge method
        throw new Error('Edge runtime detected. Use verifyTokenEdge method instead.');
    }

    /**
     * Edge-compatible token verification
     * Uses the jose library which works in Edge runtime
     */
    async verifyTokenEdge(token: string): Promise<JWTPayload> {
        try {
            const { payload } = await jwtVerify(token, this.secretKey);

            // Convert to our JWTPayload type
            return {
                user_id: payload.user_id as string,
                email: payload.email as string,
                subscription_tier: payload.subscription_tier as any,
                sessionId: payload.sessionId as string,
                sub: payload.sub,
                iat: payload.iat,
                exp: payload.exp
            };
        } catch (error) {
            console.error('JWT verification error in Edge runtime:', error);
            throw error;
        }
    }

    /**
     * Get cookie configuration for consistent settings when setting/clearing cookies
     */
    getCookieConfig(): CookieConfig {
        return {
            httpOnly: true,
            secure: this.isProd, // Only use secure in production
            sameSite: this.isProd ? 'strict' : 'lax',
            path: '/'
        };
    }
} 