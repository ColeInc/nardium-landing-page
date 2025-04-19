import { NextRequest, NextResponse } from 'next/server';
import { getOrInitResources } from '@/lib/services/initialiseResources';
import { cookies } from 'next/headers';
import { JWTPayload } from '@/lib/services/jwtService';

// Define the response type
interface AccessTokenResponse {
    success: boolean;
    access_token?: string;
    expires_in?: number;
    expiry_time?: string;
    email?: string;
    userId?: string;
    error?: string;
}

console.log('========= BACKEND AUTH GOOGLE REFRESH TOKEN ROUTE MODULE LOADED =========');

export async function GET(req: NextRequest) {
    try {
        console.log('[BACKEND-refreshAccessToken] START: Beginning access token refresh process');
        console.log('[BACKEND-refreshAccessToken] Request path:', req.nextUrl.pathname);
        console.log('[BACKEND-refreshAccessToken] Request headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));

        // Get user ID from JWT token (which was set in auth_token cookie)
        const cookieStore = cookies();
        const authToken = cookieStore.get('auth_token')?.value;

        // In Next.js, we need to manually extract user info from token
        // This would typically be done with a JWT verification function
        let userId: string | undefined;
        let userEmail: string | undefined;

        console.log('[BACKEND-refreshAccessToken] Auth token from cookie:', authToken ? 'Found' : 'Not found');

        if (!authToken) {
            console.log('[BACKEND-refreshAccessToken] Error: No auth token found in cookies');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get services
        console.log('[BACKEND-refreshAccessToken] Getting resources...');
        const resources = await getOrInitResources();
        console.log('[BACKEND-refreshAccessToken] Resources initialized');

        // Verify and extract user info from token
        const { jwtService } = resources;

        if (!jwtService) {
            console.error('[BACKEND-refreshAccessToken] JWT service not available');
            return NextResponse.json(
                { error: 'Server error: JWT service not available' },
                { status: 500 }
            );
        }

        try {
            const decoded = jwtService.verifyToken(authToken) as JWTPayload & { user_id: string; email: string };
            userId = decoded.user_id;
            userEmail = decoded.email;
            console.log('[BACKEND-refreshAccessToken] User ID from token:', userId);
        } catch (error) {
            console.log('[BACKEND-refreshAccessToken] Error verifying token:', error);
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        if (!userId) {
            console.log('[BACKEND-refreshAccessToken] Error: No user ID found in token');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { tokenService, googleAuthService } = resources;
        console.log('[BACKEND-refreshAccessToken] Token service available:', !!tokenService);
        console.log('[BACKEND-refreshAccessToken] Google auth service available:', !!googleAuthService);

        if (!tokenService || !googleAuthService) {
            console.error('[BACKEND-refreshAccessToken] Required services not available');
            return NextResponse.json(
                { error: 'Server error: Services not initialized' },
                { status: 500 }
            );
        }

        console.log(`[BACKEND-refreshAccessToken] Fetching refresh token for user ${userId}`);
        // Get the stored refresh token for this user
        const refreshToken = await tokenService.getRefreshToken(userId);
        console.log('[BACKEND-refreshAccessToken] Refresh token retrieved:', refreshToken ? 'Found (length: ' + refreshToken.length + ')' : 'Not found');

        if (!refreshToken) {
            console.log(`[BACKEND-refreshAccessToken] Error: No refresh token found for user ${userId}`);
            return NextResponse.json(
                { error: 'No refresh token found' },
                { status: 401 }
            );
        }

        console.log('[BACKEND-refreshAccessToken] Requesting new access token from Google');
        // Use the refresh token to get a new access token from Google
        const newTokens = await googleAuthService.refreshAccessToken(refreshToken);
        console.log('[BACKEND-refreshAccessToken] New tokens received:', newTokens ? 'Success' : 'Failed');
        console.log('[BACKEND-refreshAccessToken] Access token length:', newTokens.access_token?.length || 0);

        console.log('[BACKEND-refreshAccessToken] Successfully obtained new access token');

        const expiryTime = new Date(Date.now() + (newTokens.expires_in * 1000));
        console.log('[BACKEND-refreshAccessToken] Token expiry time:', expiryTime.toISOString());

        const response: AccessTokenResponse = {
            success: true,
            access_token: newTokens.access_token,
            expires_in: newTokens.expires_in,
            expiry_time: expiryTime.toISOString(),
            email: userEmail,
            userId: userId
        };

        console.log('[BACKEND-refreshAccessToken] END: Sending successful response');
        return NextResponse.json(response);
    } catch (error) {
        console.error('[BACKEND-refreshAccessToken] Access token refresh error:', error);
        return NextResponse.json(
            { error: 'Failed to refresh access token' },
            { status: 500 }
        );
    }
} 