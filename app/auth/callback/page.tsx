'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
    const router = useRouter()
    const [message, setMessage] = useState('Processing authentication...')

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = createClient()

                // Get the session - confirm the user is authenticated
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    throw error
                }

                if (!session) {
                    setMessage('No session found. Authentication failed.')
                    return
                }

                // Successfully authenticated
                setMessage('Successfully authenticated! Redirecting...')

                // In a real app, you might store the session details in a state management solution
                // For example:
                // localStorage.setItem('supabaseAccessToken', session.access_token)

                // Redirect to home page or dashboard
                setTimeout(() => {
                    router.push('/')
                }, 1000)

            } catch (error) {
                console.error('Error during auth callback:', error)
                setMessage(`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }

        handleCallback()
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Authentication</h1>
                <p>{message}</p>
            </div>
        </div>
    )
} 