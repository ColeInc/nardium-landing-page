"use client";

import emailjs from "@emailjs/browser";
import { ChangeEvent, FormEvent, LegacyRef, useEffect, useRef, useState } from "react";

const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
const emailjsTemplateKey = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_KEY ?? "";
const emailjsServiceKey = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY ?? "";

console.log("fetched deeze", emailjsPublicKey, emailjsTemplateKey, emailjsServiceKey);

export default function FeatureRequests() {
    const [featureRequest, setFeatureRequest] = useState("");
    const emailRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => emailjs.init(emailjsPublicKey), []);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setFeatureRequest(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!bodyRef.current?.value) {
            return;
        }

        // fire email to support letting them know of new feature request!
        emailjs.send(
            emailjsServiceKey,
            emailjsTemplateKey,
            {
                sender: emailRef.current?.value,
                message: bodyRef.current?.value,
            },
            emailjsPublicKey
        );

        if (emailRef.current) {
            emailRef.current.value = "";
        }
        if (bodyRef.current) {
            bodyRef.current.value = "";
        }
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
                    <div className="flex flex-col justify-center items-center">
                        <form onSubmit={handleSubmit} className="flex flex-col items-center max-w-[600px] w-full">
                            <input
                                ref={emailRef}
                                type="email"
                                className="w-full min-h-[15px] px-4 py-2 mb-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your email"
                            />
                            <textarea
                                placeholder="What would you like to be added?"
                                value={featureRequest}
                                onChange={handleInputChange}
                                className="w-full min-h-[160px] px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ref={bodyRef}
                            />
                            <button
                                type="submit"
                                className=" w-[180px] px-4 py-2 mt-2 self-end bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
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
