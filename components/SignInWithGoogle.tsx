'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function SignInWithGoogle() {
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [redirectToStripe, setRedirectToStripe] = useState(false)

    const handleSignIn = async () => {
        try {
            setIsLoading(true)
            const supabase = createClient()

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback${redirectToStripe ? '?redirect=checkout' : ''}`,
                },
            })

            if (error) {
                throw error
            }
        } catch (error) {
            console.error('Error signing in with Google:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const openModal = (shouldRedirectToStripe = false) => {
        setRedirectToStripe(shouldRedirectToStripe)
        setShowModal(true)
    }

    return (
        <>
            <div className="flex gap-3">
                <button
                    onClick={() => openModal(false)}
                    className="px-5 py-2 border border-gray-500 rounded-full bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
                >
                    Log in
                </button>

                <button
                    onClick={() => openModal(true)}
                    className="px-5 py-2 border border-blue-600 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
                >
                    Upgrade
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-60" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white p-10 rounded-2xl shadow-xl z-10 w-[400px] max-w-[90%] max-h-[90vh] overflow-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                            {redirectToStripe ? 'Upgrade Your Account' : 'Welcome Back'}
                        </h2>

                        <div className="mb-8 text-center text-gray-600">
                            {redirectToStripe
                                ? 'Sign in to your account to continue with the upgrade process.'
                                : 'Please sign in to continue using the application.'}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl mb-8 text-blue-800 text-sm">
                            <p className="font-medium mb-1">Important:</p>
                            <p>Please ensure you select the Google account you intend to use for accessing your Google Docs. This account will be linked to your application profile.</p>
                        </div>

                        <button
                            onClick={() => {
                                handleSignIn();
                            }}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium shadow-sm transition-all duration-200"
                        >
                            {isLoading ? (
                                <span>Processing...</span>
                            ) : (
                                <>
                                    <img
                                        src="https://developers.google.com/identity/images/g-logo.png"
                                        alt="Google logo"
                                        width="20"
                                        height="20"
                                        className="object-contain"
                                    />
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 