// Check for client ID and redirect URI in public env vars
if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI) {
    throw new Error(
        'Missing required Google OAuth configuration. Please check your .env file for:\n' +
        '- NEXT_PUBLIC_GOOGLE_CLIENT_ID\n' +
        '- NEXT_PUBLIC_GOOGLE_REDIRECT_URI'
    );
}

// Check for client secret in server-only env var
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
        'Missing required server-side Google OAuth configuration. Please check your .env file for:\n' +
        '- GOOGLE_CLIENT_SECRET'
    );
}

export interface GoogleConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
}

export const googleConfig: GoogleConfig = {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ]
}; 