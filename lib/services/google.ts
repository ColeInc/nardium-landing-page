

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || !process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI) {
    throw new Error(
        'Missing required Google OAuth configuration. Please check your .env file for:\n' +
        '- NEXT_PUBLIC_GOOGLE_CLIENT_ID\n' +
        '- NEXT_PUBLIC_GOOGLE_CLIENT_SECRET\n' +
        '- NEXT_PUBLIC_GOOGLE_REDIRECT_URI'
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
    clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ]
}; 