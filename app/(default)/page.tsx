import CallToAction from "@/components/call-to-action";
import Features from "@/components/features";
import Hero from "@/components/hero";
import ProductImage from "@/components/product-image";

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
