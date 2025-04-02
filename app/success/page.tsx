'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user } = useUser()
    const [message, setMessage] = useState<string>('Processing your subscription...')
    const [error, setError] = useState<string | null>(null)

    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        if (!sessionId) {
            setError('Invalid session. Please contact support.')
            return
        }

        // In a real app, you'd verify the session with your backend
        // This is just a placeholder for a real implementation
        setTimeout(() => {
            setMessage('Thank you for subscribing to Nardium Premium!')
        }, 1500)

    }, [sessionId])

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                    <p className="mb-4">Please sign in to view your subscription details.</p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Subscription Status</h1>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                ) : (
                    <p className="mb-6">{message}</p>
                )}

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Return to Home
                    </Link>

                    <Link
                        href="/dashboard"
                        className="block w-full bg-gray-100 text-gray-700 text-center px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}