import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // This is a public route that handles Google OAuth callback
        // No API key validation is needed here as it's exempt in middleware

        // Process Google OAuth callback logic here
        // ...

        return NextResponse.json({
            success: true,
            message: 'Google authentication callback processed'
        });
    } catch (error) {
        console.error('Error in Google callback:', error);
        return NextResponse.json(
            { error: 'Failed to process Google authentication' },
            { status: 500 }
        );
    }
} 