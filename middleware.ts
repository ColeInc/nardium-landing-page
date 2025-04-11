import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiRequest } from './lib/middleware/validateApiRequest';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define protected API routes that require authentication
    if (path.startsWith('/api/protected')) {
        // Validate the request with our middleware
        const response = validateApiRequest(request);

        // If validation failed, return the error response
        if (response) {
            return response;
        }

        // If validation passed, continue to the API route
        return NextResponse.next();
    }

    // For non-protected routes, just continue
    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        // Apply to all API routes that should be protected
        '/api/protected/:path*',
    ],
}; 