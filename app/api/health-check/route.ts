import { NextResponse } from 'next/server';

/**
 * Health check endpoint that returns server status and current timestamp
 * @returns JSON response with health status and timestamp
 */
export async function GET() {
    try {
        // Get current timestamp
        const timestamp = new Date().toISOString();

        // Return success response
        return NextResponse.json({
            status: 'healthy 🟢',
            timestamp,
            serverTime: Date.now()
        });
    } catch (error) {
        console.error('[health-check] Error:', error);

        // Return error response
        return NextResponse.json(
            {
                status: 'unhealthy 🔴',
                error: 'Server health check failed',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
