import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates an API request by checking for a valid API key
 * @param req The Next.js request object
 * @returns A NextResponse with 401 status if invalid, null if valid
 */
export function validateApiRequest(req: NextRequest) {
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = process.env.VALID_API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
        return NextResponse.json(
            { error: 'Unauthorized: Invalid or missing API key' },
            { status: 401 }
        );
    }

    // Request is valid
    return null;
} 