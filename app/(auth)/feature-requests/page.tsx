"use client";

import Link from "next/link";
import Image from "next/image";
import GoogleLogo from "@/public/images/google-logo.svg";
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";

export default function FeatureRequests() {
    const [featureRequest, setFeatureRequest] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setFeatureRequest(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = "nardiumapp@gmail.com";
        const subject = "Nardium - Feature Request";
        const body = `Feature Request: ${featureRequest}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            body
        )}`;
    };

    return (
        <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    {/* Page header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                        <h1 className="h1">Request a new Feature!</h1>
                    </div>

                    {/* Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="flex justify-center">
                            {/* <input
                                type="text"
                                placeholder="What would you like to be added?"
                                value={featureRequest}
                                onChange={handleInputChange}
                                className="max-w-xl px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                                /> */}
                            <textarea
                                placeholder="What would you like to be added?"
                                value={featureRequest}
                                onChange={handleInputChange}
                                className="min-w-[700px] min-h-[120px] px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
                            >
                                Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
