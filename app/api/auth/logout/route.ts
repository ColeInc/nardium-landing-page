import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // This route is protected by middleware
        // No need to explicitly check API key here

        // Process logout logic
        // ...

        return NextResponse.json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json(
            { error: 'Failed to process logout' },
            { status: 500 }
        );
    }
} 