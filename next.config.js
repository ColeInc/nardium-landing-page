/** @type {import('next').NextConfig} */

const nextConfig = {
    images: { unoptimized: true },
    // basePath: "/nardium-landing-page",
    // basePath: "/",
    env: {
        NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "qt3ZWXcX3l_wiAFhi",
        NEXT_PUBLIC_EMAILJS_TEMPLATE_KEY: "template_xpkcxon",
        NEXT_PUBLIC_EMAILJS_SERVICE_KEY: "service_02p6hzw",
        NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID: "G-ZX4L05HKN9",
    },
    // experimental: {
    //     appDir: true,
    // },
    // Optional: Add a trailing slash to all paths `/about` -> `/about/`
    // trailingSlash: true,
    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
    async headers() {
        return [
            {
                // Apply these headers to all routes
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'chrome-extension://kdmdhielhebecglcnejeakebepepiogf',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization, X-Api-Key',
                    },
                    {
                        key: 'Access-Control-Max-Age',
                        value: '86400',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
