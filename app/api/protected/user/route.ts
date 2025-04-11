import { JWTPayload } from '@/lib/services/jwtService';
import { NextRequest, NextResponse } from 'next/server';

// This handler will only be called if validateApiRequest middleware passes
export async function GET(req: NextRequest) {
    // The user object is attached by our middleware
    const user = (req as any).user as JWTPayload;

    if (!user) {
        return NextResponse.json(
            { error: 'User not found in request' },
            { status: 401 }
        );
    }

    // Return user data (excluding sensitive information)
    return NextResponse.json({
        user_id: user.user_id,
        email: user.email,
        subscription_tier: user.subscription_tier
    });
}

// Example of a protected POST endpoint
export async function POST(req: NextRequest) {
    try {
        const user = (req as any).user as JWTPayload;
        const body = await req.json();

        // Process the request with user context
        // This is just an example - implement your actual logic here

        return NextResponse.json({
            message: 'Request processed successfully',
            user_id: user.user_id,
            // Include processed data from request
            requestData: body
        });
    } catch (error) {
        console.error('Error processing protected POST request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
} 