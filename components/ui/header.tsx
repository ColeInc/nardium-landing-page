'use client'

import Link from "next/link";
import MobileMenu from "./mobile-menu";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import TestPurchaseButton from "@/components/TestPurchaseButton";
import { useUser } from "@/context/UserContext";
import { useState, useEffect, useRef } from "react";

export default function Header() {
    const { user, isLoading, signOut } = useUser();
    const [mounted, setMounted] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="absolute w-full z-30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Site branding */}
                    <div className="shrink-0 px-2 ">
                        {/* Logo */}
                        {/* <a href="/nardium-landing-page" className="block" aria-label="Nardium"> */}
                        <a href="/" className="block" aria-label="Nardium">
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

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex md:grow">
                        {/* Desktop sign in links */}
                        <ul className="flex grow justify-end flex-wrap items-center">
                            {/* <li>
                                <Link
                                    href="/signin"
                                    className="font-medium text-blue-500 hover:text-gray-200 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                                >
                                    Sign in
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="btn-sm text-white bg-blue-500 hover:bg-blue-600 ml-3">
                                    Sign up
                                </Link>
                            </li> */}
                            <li>
                                <a
                                    href="/nardium-landing-page/#features"
                                    className="font-medium text-gray-700 hover:text-gray-500 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    title="Frequently Asked Questions"
                                    className="font-medium text-gray-700 hover:text-gray-500 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                                >
                                    FAQ
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    href="/feature-requests"
                                    title="Request a New Feature!"
                                    className="font-medium text-gray-700 hover:text-gray-500 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                                >
                                    Request!
                                </Link>
                            </li> */}

                            {mounted && !isLoading && (
                                <>
                                    {user ? (
                                        <>
                                            <li>
                                                <Link
                                                    href="/dashboard"
                                                    className="font-medium text-gray-700 hover:text-gray-500 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                                                >
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li className="ml-2">
                                                <TestPurchaseButton />
                                            </li>
                                            <li className="relative" ref={dropdownRef}>
                                                <button
                                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                                    className="ml-3 flex items-center focus:outline-none"
                                                >
                                                    {user.user_metadata?.avatar_url ? (
                                                        <img
                                                            src={user.user_metadata.avatar_url}
                                                            alt={user.email || "User"}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-blue-600 text-lg font-semibold">
                                                                {user.email?.charAt(0).toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </button>

                                                {dropdownOpen && (
                                                    <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                                        <button
                                                            onClick={signOut}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                )}
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="ml-3">
                                                <SignInWithGoogle />
                                            </li>
                                        </>
                                    )}
                                </>
                            )}
                        </ul>
                    </nav>

                    <MobileMenu />
                </div>
            </div>
        </header>
    );
}
