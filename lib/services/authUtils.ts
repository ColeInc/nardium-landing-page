import { NextRequest } from 'next/server';
import { JWTService } from './jwtService';

/**
 * Extracts the authorization header from various places in the request
 * @param req NextRequest object
 * @returns The authorization header string or null if not found
 */
export function extractAuthHeader(req: NextRequest): string | null {
    // Try to get from authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
        return authHeader;
    }

    // Try to get from query parameter (less secure, but can be useful for some scenarios)
    const url = new URL(req.url);
    const tokenParam = url.searchParams.get('token');
    if (tokenParam) {
        return `Bearer ${tokenParam}`;
    }

    // Try to get from cookies
    const tokenCookie = req.cookies.get('auth_token')?.value;
    if (tokenCookie) {
        return `Bearer ${tokenCookie}`;
    }

    return null;
}

/**
 * Initializes and returns authentication resources
 */
export function getAuthResources() {
    // This is a singleton pattern to ensure we only create one instance
    if (!global.authResources) {
        global.authResources = {
            jwtService: new JWTService()
        };
    }

    return global.authResources;
}

// Extending the NodeJS global interface to include our resources
declare global {
    var authResources: {
        jwtService: JWTService;
    } | undefined;
} 