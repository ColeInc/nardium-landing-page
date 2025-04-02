'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { createClient } from '@/lib/supabaseClient'

type UserData = {
    id: string
    tier: string
    created_at: string
    email: string
}

export default function UserProfile() {
    const { user, isLoading, signOut } = useUser()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    setIsLoadingProfile(true)
                    const supabase = createClient()

                    const { data, error } = await supabase
                        .from('users')
                        .select('id, tier, created_at, email')
                        .eq('id', user.id)
                        .single()

                    if (error) {
                        throw error
                    }

                    if (data) {
                        setUserData(data)
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                } finally {
                    setIsLoadingProfile(false)
                }
            }
        }

        fetchUserData()
    }, [user])

    if (isLoading) {
        return <div>Loading user profile...</div>
    }

    if (!user) {
        return null
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-lg font-semibold">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">{user.email || 'User'}</h2>
                    <p className="text-gray-500">
                        {isLoadingProfile ? 'Loading tier...' : `Tier: ${userData?.tier || 'free'}`}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                    onClick={signOut}
                    className="text-sm text-red-600 hover:text-red-800"
                >
                    Sign out
                </button>
            </div>
        </div>
    )
} 