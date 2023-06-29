export const metadata = {
    title: "Nardium",
    description: "Explore and Navigate your Google Docs with Ease! 🔍",
    icons: {
        icon: "/favicon.ico",
    },
};

import Hero from "@/components/hero";
import Features from "@/components/features";
import Newsletter from "@/components/newsletter";
import Zigzag from "@/components/zigzag";
import Testimonials from "@/components/testimonials";
import ProductImage from "@/components/product-image";
import CallToAction from "@/components/call-to-action";

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
