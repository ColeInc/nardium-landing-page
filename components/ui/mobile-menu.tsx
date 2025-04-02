"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import SignInWithGoogle from '@/components/SignInWithGoogle';

export default function MobileMenu() {
    const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, isLoading, signOut } = useUser();
    const [mounted, setMounted] = useState(false);

    const trigger = useRef<HTMLButtonElement>(null);
    const mobileNav = useRef<HTMLDivElement>(null);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // close the mobile menu on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!mobileNav.current || !trigger.current) return;
            if (
                !mobileNavOpen ||
                mobileNav.current.contains(target as Node) ||
                trigger.current.contains(target as Node)
            )
                return;
            setMobileNavOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close the mobile menu if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!mobileNavOpen || keyCode !== 27) return;
            setMobileNavOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    return (
        <div className="flex md:hidden">
            {/* Hamburger button */}
            <button
                ref={trigger}
                className={`hamburger ${mobileNavOpen && 'active'}`}
                aria-controls="mobile-nav"
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
                <span className="sr-only">Menu</span>
                <svg
                    className="w-6 h-6 fill-current text-gray-900"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect y="4" width="24" height="2" />
                    <rect y="11" width="24" height="2" />
                    <rect y="18" width="24" height="2" />
                </svg>
            </button>

            {/*Mobile navigation */}
            <nav
                id="mobile-nav"
                ref={mobileNav}
                className="absolute top-full z-20 left-0 w-full px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out"
                style={
                    mobileNavOpen
                        ? { maxHeight: mobileNav.current?.scrollHeight, opacity: 1 }
                        : { maxHeight: 0, opacity: 0.8 }
                }
            >
                <ul className="bg-gray-200 px-4 py-2 rounded-md text-xl">
                    <li>
                        <a
                            href="/nardium-landing-page/#features"
                            className="font-medium text-gray-700 hover:text-gray-500 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                            onClick={() => setMobileNavOpen(false)}
                        >
                            Features
                        </a>
                    </li>
                    <li>
                        <Link
                            href="/faq"
                            title="Frequently Asked Questions"
                            className="font-medium text-gray-700 hover:text-gray-500 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                            onClick={() => setMobileNavOpen(false)}
                        >
                            FAQ
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/feature-requests"
                            className="font-medium text-gray-700 hover:text-gray-500 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                            onClick={() => setMobileNavOpen(false)}
                        >
                            Request!
                        </Link>
                    </li>

                    {mounted && !isLoading && (
                        <>
                            {user ? (
                                <>
                                    <li>
                                        <Link
                                            href="/dashboard"
                                            className="font-medium text-gray-700 hover:text-gray-500 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                                            onClick={() => setMobileNavOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li className="border-t border-gray-300 mt-2 pt-2">
                                        <div className="flex items-center px-4 py-2">
                                            {user.user_metadata?.avatar_url ? (
                                                <img
                                                    src={user.user_metadata.avatar_url}
                                                    alt={user.email || "User"}
                                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                    <span className="text-blue-600 text-lg font-semibold">
                                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1 truncate">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {user.email || 'User'}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setMobileNavOpen(false);
                                            }}
                                            className="w-full text-left font-medium text-red-600 hover:text-red-800 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="border-t border-gray-300 mt-2 pt-2 pb-2 flex justify-center">
                                    <div onClick={() => setMobileNavOpen(false)}>
                                        <SignInWithGoogle />
                                    </div>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}
