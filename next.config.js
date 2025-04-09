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
};

module.exports = nextConfig;
