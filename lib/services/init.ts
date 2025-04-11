import { GoogleAuthService } from './googleAuthService';
import { SupabaseAuthService } from './supabaseAuthService';
import { JwtService } from './jwtService';
import { TokenService } from './tokenService';

// Define the resources interface
interface Resources {
    googleAuthService: GoogleAuthService;
    supabaseAuthService: SupabaseAuthService;
    jwtService: JwtService;
    tokenService: TokenService;
}

// Singleton instance
let resources: Resources | null = null;

/**
 * Initialize or return existing resources
 */
export async function getOrInitResources(): Promise<Resources> {
    if (resources) {
        return resources;
    }

    // Initialize services
    const googleAuthService = new GoogleAuthService();
    const supabaseAuthService = new SupabaseAuthService();
    const jwtService = new JwtService();
    const tokenService = new TokenService();

    resources = {
        googleAuthService,
        supabaseAuthService,
        jwtService,
        tokenService
    };

    return resources;
} 