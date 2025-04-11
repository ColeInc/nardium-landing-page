// lib/services/jwtService.ts
import jwt, { JwtPayload } from 'jsonwebtoken';


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
        return jwt.verify(token, this.JWT_SECRET);
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