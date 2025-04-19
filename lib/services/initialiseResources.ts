import { SupabaseClient } from '@supabase/supabase-js';
import { GoogleAuthService, EncryptedToken } from './googleAuthService';
import { TokenService } from './tokenService';
import { SupabaseAuthService } from './supabaseAuthService';
import { JwtService } from './jwtService';
import Stripe from 'stripe';
import { createClient } from '../supabaseClient';

/**
 * Simple encryption service for Next.js
 */
export class EncryptionService {
    private ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'dev-encryption-key';

    encrypt(data: string): string {
        // For a real implementation, use a proper encryption library
        console.log('Encrypting data');
        return `encrypted_${data}`;
    }

    decrypt(encryptedData: string): string {
        // For a real implementation, use a proper decryption method
        console.log('Decrypting data');
        if (encryptedData.startsWith('encrypted_')) {
            return encryptedData.substring(10);
        }
        return encryptedData;
    }
}

/**
 * Adapter for EncryptionService that implements the interface expected by GoogleAuthService
 */
class GoogleEncryptionAdapter {
    private encryptionService: EncryptionService;

    constructor(encryptionService: EncryptionService) {
        this.encryptionService = encryptionService;
    }

    encrypt(text: string): EncryptedToken {
        const encrypted = this.encryptionService.encrypt(text);
        return {
            iv: 'dummy-iv',
            encrypted: encrypted,
            authTag: 'dummy-tag'
        };
    }

    decrypt(encryptedText: EncryptedToken): string {
        return this.encryptionService.decrypt(encryptedText.encrypted);
    }
}

// Declare resource container
interface Resources {
    supabase: SupabaseClient | null;
    supabaseAdmin: SupabaseClient | null;
    googleAuthService: GoogleAuthService | null;
    tokenService: TokenService | null;
    supabaseAuthService: SupabaseAuthService | null;
    jwtService: JwtService | null;
    encryptionService: EncryptionService | null;
    stripeClient: Stripe | null;
}

// Track initialization state
let isInitialized = false;
let isInitializing = false;
let initPromise: Promise<Resources> | null = null;

// Resource container
const resources: Resources = {
    supabase: null,
    supabaseAdmin: null,
    googleAuthService: null,
    tokenService: null,
    supabaseAuthService: null,
    jwtService: null,
    encryptionService: null,
    stripeClient: null
};

/**
 * Get Supabase client (creates or returns existing instance)
 */
export function getSupabase(): SupabaseClient {
    if (!resources.supabase) {
        resources.supabase = createClient();
    }
    // Type assertion since we ensure it's not null
    return resources.supabase as SupabaseClient;
}

/**
 * Get Supabase Admin client (creates or returns existing instance)
 * In Next.js, we need to handle this differently from the regular client
 */
export function getSupabaseAdmin(): SupabaseClient {
    if (!resources.supabaseAdmin) {
        // Create admin client using service role key instead of anon key
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase URL or service role key');
        }

        // Use the standard createClient but with the service role key
        const { createClient } = require('@supabase/supabase-js');
        resources.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    }
    // Type assertion since we ensure it's not null
    return resources.supabaseAdmin as SupabaseClient;
}

/**
 * Create Stripe client
 */
function createStripeClient(): Stripe {
    console.log('Creating Stripe client...');
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

    if (!stripeSecretKey) {
        throw new Error('Missing Stripe secret key. Please check your environment variables.');
    }

    return new Stripe(stripeSecretKey, {
        // API version that matches the project's dependency
        apiVersion: '2023-10-16' as any, // Type assertion to bypass the API version restriction
        // Optimize for serverless environment
        httpClient: Stripe.createFetchHttpClient(),
        timeout: 5000, // 5 second timeout for API calls
    });
}

/**
 * Check if the request path is for health check
 */
export function isHealthCheckPath(path: string): boolean {
    return path === '/api/health' || path === '/health';
}

/**
 * Initialize all resources, reusing existing ones if available
 * Adapted for Next.js serverless model
 */
export async function initializeResources(requestPath?: string): Promise<Resources> {
    // Skip full initialization for health check requests
    if (requestPath && isHealthCheckPath(requestPath)) {
        console.log('Health check request detected, skipping full initialization');
        return resources;
    }

    // Special case for development mode
    if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode: Initializing resources once...');
    } else {
        console.log('Production mode: Checking resource initialization status...');
    }

    // If already initialized, return the resources
    if (isInitialized) {
        console.log('Resources already initialized, reusing...');
        return resources;
    }

    // If initialization is in progress, wait for it
    if (isInitializing && initPromise) {
        console.log('Resources initialization in progress, waiting...');
        return initPromise;
    }

    console.log('Initializing resources...');
    isInitializing = true;

    // Create a promise for the initialization
    initPromise = new Promise<Resources>(async (resolve, reject) => {
        try {
            // Initialize encryption service first (needed by other services)
            resources.encryptionService = new EncryptionService();

            // Initialize Supabase clients
            resources.supabase = getSupabase();
            resources.supabaseAdmin = getSupabaseAdmin();
            resources.stripeClient = createStripeClient();

            // Initialize services (in dependency order)
            resources.jwtService = new JwtService();
            resources.tokenService = new TokenService();
            const googleEncryptionAdapter = new GoogleEncryptionAdapter(resources.encryptionService);
            resources.googleAuthService = new GoogleAuthService(googleEncryptionAdapter);
            resources.supabaseAuthService = new SupabaseAuthService();

            // Mark as initialized
            isInitialized = true;
            isInitializing = false;
            console.log('Resources initialized successfully');

            resolve(resources);
        } catch (error) {
            isInitializing = false;
            console.error('Failed to initialize resources:', error);
            reject(error);
        }
    });

    return initPromise;
}

/**
 * Get resources - will throw if not initialized
 * Use this when you're sure initialization has happened
 */
export function getResources(): Resources {
    console.log('[getResources] Called, initialization state:', isInitialized);
    if (!isInitialized) {
        console.error('[getResources] ERROR: Resources accessed before initialization');
        throw new Error('Resources accessed before initialization');
    }

    // Log which resources are available
    const availableResources = Object.entries(resources)
        .map(([key, value]) => `${key}: ${value !== null}`)
        .join(', ');
    console.log(`[getResources] Available resources: ${availableResources}`);

    return resources;
}

/**
 * Get initialized resources or initialize them if needed
 * Use this when you're not sure if initialization has happened
 */
export async function getOrInitResources(requestPath?: string): Promise<Resources> {
    console.log('[getOrInitResources] Called with requestPath:', requestPath || 'none');
    console.log('[getOrInitResources] Current state - initialized:', isInitialized, 'initializing:', isInitializing);

    if (!isInitialized) {
        console.log('[getOrInitResources] Resources not initialized, starting initialization');
        return initializeResources(requestPath);
    }

    console.log('[getOrInitResources] Resources already initialized, returning existing resources');
    return resources;
}
