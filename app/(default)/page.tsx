// export const metadata = {
//     title: "Nardium",
//     description: "Explore and Navigate your Google Docs with Ease! 🔍",
//     icons: {
//         icon: "/favicon.ico",
//     },
// };

// export const metadata: Metadata = {
//     title: "Nardium",
//     description: "Explore and Navigate your Google Docs with Ease! 🔍",
//     icons: {
//         icon: {
//             url: "/favicon.ico",
//             type: "image/ico",
//         },
//         shortcut: { url: "/favicon.ico", type: "image/ico" },
//     },
// };

import Hero from "@/components/hero";
import Features from "@/components/features";
import Newsletter from "@/components/newsletter";
import Zigzag from "@/components/zigzag";
import Testimonials from "@/components/testimonials";
import ProductImage from "@/components/product-image";
import CallToAction from "@/components/call-to-action";
import { Metadata } from "next";

export default function Home() {
    return (
        <>
            <Hero />
            <ProductImage />
            <Features />
            <CallToAction />
            {/* <Zigzag /> */}
            {/* <Testimonials /> */}
            {/* <Newsletter /> */}
        </>
    );
}
