import Link from "next/link";
import Image from "next/image";
import GoogleLogo from "@/public/images/google-logo.svg";

export const metadata = {
    title: "Nardium",
    description: "Explore and Navigate your Google Docs with Ease! 🔍",
};

export default function SignUp() {
    return (
        <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    {/* Page header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                        <h1 className="h1">Easily Navigate around your Google Docs</h1>
                    </div>

                    {/* Form */}
                    <div className="max-w-sm mx-auto">
                        <form>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full px-3">
                                    <button className="btn p-3 text-white bg-white hover:bg-gray-100 w-full relative flex items-center rounded-md shadow-sm">
                                        <div className="">
                                            <Image src={GoogleLogo} alt="Sign in with Google" width={32} height={32} />
                                        </div>
                                        <span
                                            className="h-6 flex items-center border-r border-white border-opacity-25 mr-4"
                                            aria-hidden="true"
                                        ></span>
                                        <span className="flex-auto pl-16 pr-8 -ml-16 text-gray-700">
                                            Sign up with Google
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="flex items-center my-6">
                            <div className="border-t border-gray-700 border-dotted grow mr-3" aria-hidden="true"></div>
                            <div className="text-gray-400">Or, register with your email</div>
                            <div className="border-t border-gray-700 border-dotted grow ml-3" aria-hidden="true"></div>
                        </div>
                        <form>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3">
                                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="full-name">
                                        Full Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="full-name"
                                        type="text"
                                        className="form-input w-full text-gray-300"
                                        placeholder="First and last name"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3">
                                    <label
                                        className="block text-gray-300 text-sm font-medium mb-1"
                                        htmlFor="company-name"
                                    >
                                        Company Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="company-name"
                                        type="text"
                                        className="form-input w-full text-gray-300"
                                        placeholder="Your company or app name"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3">
                                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">
                                        Work Email <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="form-input w-full text-gray-300"
                                        placeholder="you@yourcompany.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-4">
                                <div className="w-full px-3">
                                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">
                                        Password <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-input w-full text-gray-300"
                                        placeholder="Password (at least 10 characters)"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 text-center">
                                I agree to be contacted by Open PRO about this offer as per the Open PRO{" "}
                                <Link
                                    href="#"
                                    className="underline text-gray-400 hover:text-gray-200 hover:no-underline transition duration-150 ease-in-out"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </div>
                            <div className="flex flex-wrap -mx-3 mt-6">
                                <div className="w-full px-3">
                                    <button className="btn text-white bg-purple-600 hover:bg-purple-700 w-full">
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="text-gray-400 text-center mt-6">
                            Already using Open PRO?{" "}
                            <Link
                                href="/signin"
                                className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
