'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Session, User } from '@supabase/supabase-js'

type UserContextType = {
    user: User | null
    session: Session | null
    isLoading: boolean
    accessToken: string | null
    signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [accessToken, setAccessToken] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        // Check for existing session
        const initializeUser = async () => {
            try {
                setIsLoading(true)

                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    throw error
                }

                if (session) {
                    setSession(session)
                    setUser(session.user)
                    setAccessToken(session.access_token)
                }
            } catch (error) {
                console.error('Error initializing user:', error)
            } finally {
                setIsLoading(false)
            }
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setAccessToken(session?.access_token ?? null)
                setIsLoading(false)
            }
        )

        initializeUser()

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
    }

    return (
        <UserContext.Provider value={{ user, session, isLoading, accessToken, signOut }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
} 