import { getOrInitResources } from '@/lib/services/initialiseResources';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

console.log('========= BACKEND AUTH GOOGLE CALLBACK ROUTE MODULE LOADED =========');

export async function GET(req: NextRequest) {
    console.log('========= BACKEND AUTH GOOGLE CALLBACK ROUTE HANDLER CALLED =========');
    try {
        console.log('Starting Backend Google OAuth callback handling');

        const url = req.url;
        const headers = Object.fromEntries(req.headers.entries());
        const origin = req.headers.get('origin');

        console.log('REQUEST OBJECT:', {
            headers: {
                ...headers,
                authorization: headers.authorization ? 'Bearer <token>' : 'none'
            },
            url,
            method: req.method,
            origin,
            // Next.js request properties for debugging
            nextInfo: {
                nextUrl: req.nextUrl,
                geo: req.geo || 'none'
            }
        });

        // Try to get code from URL
        let code: string | undefined;
        const searchParams = req.nextUrl.searchParams;

        if (searchParams.has('code')) {
            // Standard way - from search params
            code = searchParams.get('code') || undefined;
            console.log('Found code in searchParams:', !!code);
        } else if (url && url.includes('code=')) {
            // Try parsing from URL if search params object is missing but URL has code
            console.log('No code in searchParams, trying to parse from URL:', url);
            const urlObj = new URL(url);
            code = urlObj.searchParams.get('code') || undefined;
        }

        if (!code || typeof code !== 'string') {
            console.log('Error: No authorization code provided or invalid format');
            console.log('Request details for debugging:', {
                url,
                searchParams: Object.fromEntries(searchParams.entries()),
                headers: Object.keys(headers)
            });
            const errorResponse = NextResponse.json(
                { error: 'Authorization code is required' },
                { status: 400 }
            );

            return errorResponse;
        }

        // Get services from initialization module
        const resources = await getOrInitResources();
        const { googleAuthService, supabaseAuthService, jwtService } = resources;

        console.log('Authenticating with Google...');
        const tokens = await googleAuthService!.authenticateUser(code);
        console.log('Successfully obtained Google tokens');

        console.log('Verifying user info from ID token...');
        const userData = await googleAuthService!.verifyAndGetUserInfo(tokens.id_token);
        console.log(`User info verified for email: ${userData.email}`);

        if (!tokens.refresh_token) {
            console.log('Error: No refresh token received from Google');
            throw new Error('No refresh token received from Google');
        }

        console.log('Encrypting refresh token...');
        const encryptedRefreshToken = await googleAuthService!.encryptRefreshToken(tokens.refresh_token);

        console.log('Creating/updating user in Supabase...');
        console.log('Storing encrypted refresh token in Supabase:', encryptedRefreshToken);
        const user = await supabaseAuthService!.createOrUpdateUser(
            userData.email,
            userData.sub,
            encryptedRefreshToken
        );
        console.log(`User ${user.id} created/updated in Supabase`);

        // Generate a unique session ID
        const sessionId = uuidv4();

        // Create JWT token with user info
        const jwtPayload = {
            user_id: user.id,
            email: user.email,
            sessionId: sessionId,
            subscription_tier: user.subscription_tier
        };
        const jwtToken = jwtService!.createSessionToken(jwtPayload);

        console.log('Authentication process completed successfully');

        const response = {
            success: true,
            jwt_token: jwtToken,
            user: {
                email: user.email,
                sub: userData.sub,
                subscription_tier: user.subscription_tier
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
} 