import "./css/style.css";

import { Inter, Architects_Daughter } from "next/font/google";

import Header from "@/components/ui/header";
import Banner from "@/components/banner";
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

export const metadata = {
    title: "Nardium",
    description: "Explore and Navigate your Google Docs with Ease! 🔍",
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
                <div className="flex flex-col min-h-screen overflow-hidden">
                    <Header />
                    {children}
                    {/* <Banner /> */}
                </div>
            </body>
        </html>
    );
}
