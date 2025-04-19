import { GoogleAuthService } from './googleAuthService';
import { SupabaseAuthService } from './supabaseAuthService';
import { JwtService } from './jwtService';
import { TokenService } from './tokenService';
import { EncryptionService } from './encryptionService';

// Define the resources interface
interface Resources {
    googleAuthService: GoogleAuthService;
    supabaseAuthService: SupabaseAuthService;
    jwtService: JwtService;
    tokenService: TokenService;
    encryptionService: EncryptionService;
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
    const encryptionService = new EncryptionService();
    const googleAuthService = new GoogleAuthService(encryptionService);
    const supabaseAuthService = new SupabaseAuthService(encryptionService);
    const jwtService = new JwtService();
    const tokenService = new TokenService();

    resources = {
        googleAuthService,
        supabaseAuthService,
        jwtService,
        tokenService,
        encryptionService
    };

    return resources;
} 