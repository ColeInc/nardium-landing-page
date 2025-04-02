import "./css/style.css";
import type { Metadata } from 'next';
import { Inter, Architects_Daughter } from "next/font/google";
import './globals.css';
import { UserProvider } from '@/context/UserContext';

import Header from "@/components/ui/header";
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID;

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const architects_daughter = Architects_Daughter({
    subsets: ["latin"],
    variable: "--font-architects-daughter",
    weight: "400",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Nardium - Google Docs Outline Tool",
    description: "A powerful tool for creating outlines in Google Docs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){window.dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}');
                    `}
                </Script>
            </head>
            {/* <body className={`${inter.variable} ${architects_daughter.variable} font-inter antialiased bg-gray-900 text-gray-200 tracking-tight`}> */}
            <body
                className={`${inter.variable} ${architects_daughter.variable} font-inter antialiased bg-gray-50 text-gray-700 tracking-tight`}
            >
                <UserProvider>
                    {/* <div className="flex flex-col min-h-screen overflow-hidden bg-gray-900"> */}
                    <div className="flex flex-col min-h-screen overflow-hidden">
                        <Header />
                        {children}
                        {/* <Banner /> */}
                    </div>
                </UserProvider>
            </body>
        </html>
    );
}
