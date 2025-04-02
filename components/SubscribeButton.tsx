'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'

export default function SubscribeButton() {
    const { user, accessToken, isLoading } = useUser()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubscribe = async () => {
        if (!user || !accessToken) {
            setError('You must be signed in to subscribe')
            return
        }

        try {
            setIsProcessing(true)
            setError(null)

            // Call backend API to create a Stripe checkout session
            const response = await fetch('/api/create-stripe-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.email
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create checkout session')
            }

            const { checkoutUrl } = await response.json()

            // Redirect to Stripe checkout
            window.location.href = checkoutUrl

        } catch (err) {
            console.error('Error creating checkout session:', err)
            setError(err instanceof Error ? err.message : 'Failed to create checkout session')
        } finally {
            setIsProcessing(false)
        }
    }

    // Don't render the button if user is not authenticated
    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return null
    }

    return (
        <div>
            <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
                {isProcessing ? 'Processing...' : 'Subscribe Now'}
            </button>

            {error && (
                <p className="mt-2 text-red-600 text-sm">{error}</p>
            )}
        </div>
    )
} 