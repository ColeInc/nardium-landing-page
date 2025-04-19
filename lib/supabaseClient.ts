import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Browser client for client-side usage
export const createClient = () => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    }

    // For server-side use createSupabaseClient instead
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// Admin client for server-side operations that need admin privileges
export const createAdminClient = () => {
    // This should only be used server-side
    if (typeof window !== 'undefined') {
        throw new Error('Admin client should not be used on the client-side')
    }

    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
} 