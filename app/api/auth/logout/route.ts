import { NextRequest, NextResponse } from 'next/server';
import { getOrInitResources } from '@/lib/services/init';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
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

                // Properly decode the token
                const decoded = jwtService.verifyToken(authToken.value) as { user_id: string };
                userId = decoded.user_id;
            } catch (e) {
                // If verification fails, continue with logout anyway
                console.log('Error verifying token during logout:', e);
            }
        }

        console.log(`Logging out user: ${userId}`);

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

        console.log('Logout successful');
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Failed to process logout' },
            { status: 500 }
        );
    }
} 