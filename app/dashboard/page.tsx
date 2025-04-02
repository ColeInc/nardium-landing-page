'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserProfile from '@/components/UserProfile'
import { useUser } from '@/context/UserContext'

export default function DashboardPage() {
    const router = useRouter()
    const { user, isLoading } = useUser()

    useEffect(() => {
        // Redirect to home if not authenticated
        if (!isLoading && !user) {
            router.push('/')
        }
    }, [isLoading, user, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading dashboard...</p>
            </div>
        )
    }

    if (!user) {
        return null // Will be redirected by the useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <UserProfile />
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>

                            {/* This would typically pull real subscription data from your backend */}
                            <div className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Plan</span>
                                    <span className="font-medium">Premium</span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Status</span>
                                    <span className="font-medium text-green-600">Active</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Next billing date</span>
                                    <span className="font-medium">May 12, 2024</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button className="text-sm text-blue-600 hover:text-blue-800">
                                    Manage subscription
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 