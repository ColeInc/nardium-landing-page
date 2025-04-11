import { NextResponse, type NextRequest } from 'next/server';
import { validateApiRequest } from './lib/middleware/validateApiRequest';

// Define public routes that bypass API key validation
const PUBLIC_API_ROUTES = [
    '/api/auth/google/callback',
    '/api/stripe/webhook'
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only process API routes
    if (pathname.startsWith('/api/')) {
        // Check if the route is public (should bypass validation)
        if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
            return NextResponse.next();
        }

        // Validate the API request
        const validationResult = validateApiRequest(request);
        if (validationResult) {
            return validationResult; // Return 401 response from validation function
        }

        // Request is valid, continue
        return NextResponse.next();
    }

    // Non-API routes pass through
    return NextResponse.next();
}

// Configure middleware to only run on API routes
export const config = {
    matcher: ['/api/:path*'],
}; 