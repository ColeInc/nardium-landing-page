import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <div className="py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Top area: Blocks */}
                    {/* <div className="grid md:grid-cols-12 gap-8 lg:gap-20 mb-8 md:mb-12"> */}
                    <div className="flex justify-start mb-8 md:mb-12">
                        {/* 1st block */}
                        <div className="">
                            <div className="mb-2">
                                {/* Logo */}
                                <a href="/nardium-landing-page" className="block" aria-label="Nardium">
                                    <svg
                                        width="20"
                                        height="38"
                                        viewBox="0 0 70 84"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect width="14" height="84" fill="#1996F0" />
                                        <rect x="56" width="14" height="84" fill="#1996F0" />
                                        <path d="M14.4828 0L70 84H55.5172L0 0H14.4828Z" fill="#1996F0" />
                                        <path d="M14 0V22L0 0H14Z" fill="#3F13EE" />
                                        <path d="M56 62L70 84H56V62Z" fill="#3F13EE" />
                                    </svg>
                                </a>
                            </div>
                            <div className="text-gray-400 text-sm">&copy; Nardium App 2023</div>
                        </div>
                        {/* 2nd, 3rd and 4th blocks */}
                        <div className="ml-auto">
                            <div className="text-sm text-right">
                                <h6 className="text-gray-200 font-medium mb-1">Resources</h6>
                                <ul>
                                    <li className="mb-1">
                                        <Link
                                            href="/privacy-policy"
                                            className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out"
                                            aria-label="Nardium"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <Link
                                            href="https://chrome.google.com/webstore/detail/nardium-google-docs-navig/bmomoeeeljdicegfjigecnlmeifmhmam"
                                            target="_blank"
                                            className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out"
                                        >
                                            Chrome Web Store
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <Link
                                            href="https://github.com/ColeInc/nardium-landing-page"
                                            className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out"
                                        >
                                            Github
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom area */}
                    <div className="md:flex md:items-center md:justify-between">
                        {/* Social links */}
                        <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
                            <li className="mr-2">
                                <Link
                                    href="https://github.com/ColeInc/nardium-landing-page"
                                    className="flex justify-center items-center text-blue-500 bg-gray-800 hover:text-gray-100 hover:bg-blue-600 rounded-full transition duration-150 ease-in-out"
                                    aria-label="Github"
                                >
                                    <svg
                                        className="w-8 h-8 fill-current"
                                        viewBox="0 0 32 32"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                                    </svg>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://twitter.com/developer_cole"
                                    className="flex justify-center items-center text-blue-500 bg-gray-800 hover:text-gray-100 hover:bg-blue-600 rounded-full transition duration-150 ease-in-out"
                                    aria-label="Twitter"
                                >
                                    <svg
                                        className="w-8 h-8 fill-current"
                                        viewBox="0 0 32 32"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M24 11.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H8c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8z" />
                                    </svg>
                                </Link>
                            </li>
                        </ul>

                        {/* Copyrights note */}
                        <div className="text-gray-400 text-xs mr-4">Designed by Cole.</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
