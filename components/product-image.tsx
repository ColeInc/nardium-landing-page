import React from "react";
import Image from "next/image";
import FeatImage03 from "@/public/images/nardium-feature-v3.jpeg";

const ProductImage = () => {
    return (
        // <div className="max-w-6xl mx-auto px-4 sm:px-6 relative flex justify-center">
        //     <Image src={FeatImage03} alt="Nardium Google Docs Navigation Panel Example" width={500} height={300} />
        // </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative flex justify-center">
            <div className="lg:w-1280 md:w-1000 sm:w-600 rounded-md overflow-hidden">
                <Image
                    src={FeatImage03}
                    alt="Nardium Google Docs Navigation Panel Example"
                    // layout="responsive"
                    width={900}
                    height={600}
                />
            </div>
        </div>
    );
};

export default ProductImage;
