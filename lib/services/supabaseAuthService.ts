import { createClient } from '../supabaseClient';

// Define User type
export interface User {
    id: string;
    email: string;
    google_id: string;
    refresh_token?: string;
    subscription_tier: string;
    created_at: string;
    updated_at?: string;
}

// Use the supabaseAdmin from the function
const supabaseAdmin = createClient();

export class SupabaseAuthService {
    private encryptionService: any; // Use 'any' to bypass type checking conflicts

    constructor(encryptionService: any) {
        this.encryptionService = encryptionService;
    }

    /**
     * Create or update a user in Supabase
     */
    async createOrUpdateUser(email: string, googleId: string, encryptedRefreshToken: string): Promise<User> {
        // First, check if user exists
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            // Update existing user with new refresh token
            const { data, error } = await supabaseAdmin
                .from('users')
                .update({
                    google_id: googleId,
                    refresh_token: encryptedRefreshToken,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingUser.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        }

        // Create new user
        const { data, error } = await supabaseAdmin
            .from('users')
            .insert({
                email,
                google_id: googleId,
                refresh_token: encryptedRefreshToken,
                subscription_tier: 'free',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) throw error;
        return data;
    }
} 