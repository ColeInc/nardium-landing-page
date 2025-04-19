import { NextRequest, NextResponse } from 'next/server';
import { extractAuthHeader, getAuthResources } from '../services/authUtils';
import { JWTPayload } from '../services/jwtService';


// Extending NextRequest to include the user property
declare module 'next/server' {
    interface NextRequest {
        user?: JWTPayload;
    }
}

/**
 * Validates an API request by checking for a valid JWT token
 * @param req The Next.js request object
 * @returns A NextResponse with 401/500 status if invalid, null if valid
 */
export async function validateApiRequest(req: NextRequest) {
    try {
        // Use the helper function to extract the authorization header
        const authHeader = extractAuthHeader(req);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('[validateApiRequest] Authorization header missing or invalid format');
            return NextResponse.json(
                { error: 'Unauthorized: Missing or invalid token' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        console.log('[validateApiRequest] Token extracted, length:', token.length);

        // Initialize resources if not already initialized
        console.log('[validateApiRequest] Getting resources...');
        const resources = getAuthResources();

        const jwtService = resources?.jwtService;
        console.log('[validateApiRequest] JWT service available:', !!jwtService);

        if (!jwtService) {
            console.error('[validateApiRequest] JWT service not initialized');
            return NextResponse.json(
                { error: 'Server error: Authentication service unavailable' },
                { status: 500 }
            );
        }

        try {
            console.log('[validateApiRequest] Verifying JWT token...');

            // Use Edge-compatible verification method
            const payload = await jwtService.verifyTokenEdge(token);
            console.log('[validateApiRequest] Token verified successfully for user:', payload.user_id);

            // Add user data to request
            (req as any).user = {
                user_id: payload.user_id,
                email: payload.email,
                sessionId: payload.sessionId,
                subscription_tier: payload.subscription_tier
            };

            // Create response object
            const response = NextResponse.next();

            // Request is valid
            return response;
        } catch (error) {
            console.error('[validateApiRequest] Token verification failed:', error);
            return NextResponse.json(
                { error: 'Unauthorized: Invalid token' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('[validateApiRequest] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
} 