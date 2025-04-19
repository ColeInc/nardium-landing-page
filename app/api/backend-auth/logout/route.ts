import { NextRequest, NextResponse } from 'next/server';
import { getOrInitResources } from '@/lib/services/initialiseResources';
import { cookies } from 'next/headers';

console.log('========= BACKEND AUTH LOGOUT ROUTE MODULE LOADED =========');

export async function GET(req: NextRequest) {
    console.log('========= BACKEND AUTH LOGOUT HANDLER CALLED =========');
    try {
        // Get user ID from cookie if available
        const cookieStore = cookies();
        const authToken = cookieStore.get('auth_token');

        // Extract user ID for logging purposes
        let userId = 'unknown';
        if (authToken) {
            try {
                // Get resources to verify the token properly
                const resources = await getOrInitResources();
                const { jwtService } = resources;

                if (!jwtService) {
                    console.log('[BACKEND-LOGOUT] JWT service not available');
                    throw new Error('JWT service not available');
                }

                // Properly decode the token
                const decoded = jwtService.verifyToken(authToken.value) as { user_id: string };
                userId = decoded.user_id;
            } catch (e) {
                // If verification fails, continue with logout anyway
                console.log('[BACKEND-LOGOUT] Error verifying token during logout:', e);
            }
        }

        console.log(`[BACKEND-LOGOUT] Logging out user: ${userId}`);

        // Create response with success message
        const response = NextResponse.json({
            success: true,
            message: 'User logged out successfully'
        });

        // Clear the auth_token cookie
        // In Next.js, we use the Response to set cookies for the client
        response.cookies.set({
            name: 'auth_token',
            value: '',
            expires: new Date(0), // Set to epoch time to expire immediately
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        console.log('[BACKEND-LOGOUT] Logout successful');
        return response;
    } catch (error) {
        console.error('[BACKEND-LOGOUT] Logout error:', error);
        return NextResponse.json(
            { error: 'Failed to process logout' },
            { status: 500 }
        );
    }
} 