import Image from "next/image";

import FeatImage01 from "@/public/images/features-03-image-01.png";
import FeatImage02 from "@/public/images/features-03-image-02.png";
import FeatImage03 from "@/public/images/features-03-image-03.png";

export default function CallToAction() {
    return (
        <section>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20 border-t border-gray-800">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                        <h1 className="h2 mb-4">Discover a new level of Document Navigation</h1>
                        <p className="text-xl text-gray-600">
                            Seamlessly explore and navigate your document's hierarchy like never before. Add To Chrome
                            now for a clear and streamlined editing experience. 💪💻
                        </p>

                        <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
                            <div data-aos="fade-up" data-aos-delay="400">
                                <a
                                    className="btn text-white bg-blue-500 hover:bg-blue-600 w-full mt-8 rounded-md sm:w-auto sm:mb-0"
                                    href="https://chrome.google.com/webstore/detail/nardium-google-docs-navig/bmomoeeeljdicegfjigecnlmeifmhmam"
                                    target="_blank"
                                >
                                    Add Nardium Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
