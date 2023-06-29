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

export default function Home() {
    return (
        <>
            <Hero />
            <ProductImage />
            <Features />
            <Zigzag />
            {/* <Testimonials /> */}
            {/* <Newsletter /> */}
        </>
    );
}
