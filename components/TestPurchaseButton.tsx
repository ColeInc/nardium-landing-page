'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'

export default function TestPurchaseButton() {
    const { user, accessToken, isLoading } = useUser()
    const [isProcessing, setIsProcessing] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleTestPurchase = async () => {
        if (!user || !accessToken) {
            setError('You must be signed in to test a purchase')
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setMessage(null)

            // Call backend API to create a Stripe checkout session
            const response = await fetch('/api/test-stripe-purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    userId: user.id
                })
            })

            // Handle potential server errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json().catch(() => {
                throw new Error('Failed to parse server response');
            });

            // Redirect to Stripe Checkout
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error('No checkout URL provided - check Stripe configuration');
            }

        } catch (err) {
            console.error('Error creating checkout session:', err)
            setError(err instanceof Error ? err.message : 'Failed to create checkout session')
            setIsProcessing(false)
        }
    }

    // Don't render the button if user is not authenticated
    if (isLoading || !user) {
        return null
    }

    return (
        <div className="relative">
            <button
                onClick={handleTestPurchase}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm"
            >
                {isProcessing ? 'Processing...' : 'Purchase Test ($1)'}
            </button>

            {message && (
                <div className="absolute top-full mt-2 right-0 p-2 bg-green-100 text-green-800 text-xs rounded shadow-md whitespace-nowrap">
                    {message}
                </div>
            )}

            {error && (
                <div className="absolute top-full mt-2 right-0 p-2 bg-red-100 text-red-800 text-xs rounded shadow-md whitespace-nowrap max-w-xs overflow-auto">
                    {error}
                </div>
            )}
        </div>
    )
} 