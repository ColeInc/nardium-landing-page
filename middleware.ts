import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiRequest } from './lib/middleware/validateApiRequest';

// Define public routes that bypass API key validation
const PUBLIC_API_ROUTES = [
    '/api/health-check',
    '/api/backend-auth/google/callback',
    '/api/stripe/webhook',
];

// Chrome extension ID that needs access to the API - directly use the string from env var
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGINS || '*';
console.log("Allowed origin: ", ALLOWED_ORIGIN);

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const fullUrl = request.url;
    console.log(`[Middleware] Processing request for path: ${path}`);
    console.log(`[Middleware] Full URL: ${fullUrl}`);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key, x-requested-with, X-Requested-With, x-client-id, X-Client-Id, X-Client-Version');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

        return response;
    }

    // Add CORS headers to all responses
    const response = NextResponse.next();
    const origin = request.headers.get('origin');

    // Check if the origin matches our allowed origin
    if (origin && (ALLOWED_ORIGIN === '*' || origin === ALLOWED_ORIGIN)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else if (ALLOWED_ORIGIN === '*') {
        response.headers.set('Access-Control-Allow-Origin', '*');
        // Note: Cannot use wildcard with credentials
    }

    // Only process API routes
    if (path.startsWith('/api/')) {
        console.log(`[Middleware] API route detected: ${path}`);

        // Debug output to see what's being checked
        console.log(`[Middleware] Checking if ${path} is in public routes: ${PUBLIC_API_ROUTES.join(', ')}`);
        console.log(`[Middleware] Path includes check: ${PUBLIC_API_ROUTES.includes(path)}`);

        // Check if the route is a callback route
        const isGoogleCallback = path === '/api/backend-auth/google/callback';
        console.log(`[Middleware] Is Google callback route: ${isGoogleCallback}`);

        // Check if the route is public (should bypass validation)
        if (PUBLIC_API_ROUTES.includes(path) || isGoogleCallback) {
            console.log(`[Middleware] Public API route detected, bypassing validation: ${path}`);
            return response;
        }

        console.log(`[Middleware] Protected API route, starting validation: ${path}`);
        // Validate the request with our middleware
        const validationResponse = validateApiRequest(request);

        // If validation failed, return the error response with CORS headers
        if (validationResponse) {
            console.log(`[Middleware] Validation failed for: ${path}`);
            if (origin && (ALLOWED_ORIGIN === '*' || origin === ALLOWED_ORIGIN)) {
                validationResponse.headers.set('Access-Control-Allow-Origin', origin);
                validationResponse.headers.set('Access-Control-Allow-Credentials', 'true');
            } else if (ALLOWED_ORIGIN === '*') {
                validationResponse.headers.set('Access-Control-Allow-Origin', '*');
                // Note: Cannot use wildcard with credentials
            }
            return validationResponse;
        }

        console.log(`[Middleware] Validation successful for: ${path}`);
        // If validation passed, continue to the API route
        return response;
    }

    console.log(`[Middleware] Non-API route, continuing: ${path}`);
    // For non-API routes, just continue
    return response;
}

// Configure which paths the middleware should run on
export const config = {
    matcher: ['/api/:path*'],
}; 