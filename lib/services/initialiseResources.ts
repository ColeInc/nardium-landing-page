import { SupabaseClient } from '@supabase/supabase-js';
import { GoogleAuthService } from './googleAuthService';
import { TokenService } from './tokenService';
import { SupabaseAuthService } from './supabaseAuthService';
import { JwtService } from './jwtService';
import Stripe from 'stripe';
import { createClient, createAdminClient } from '../supabaseClient';
import { EncryptionService } from './encryptionService';

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
        // Use our dedicated admin client creator
        resources.supabaseAdmin = createAdminClient();
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
 * Check if Supabase connection is working
 * @returns {Promise<{isConnected: boolean, error?: any}>} Connection status and error if any
 */
export async function checkSupabaseConnection(): Promise<{ isConnected: boolean, error?: any }> {
    try {
        console.log('Checking Supabase connection...');
        // Get or initialize the Supabase admin client
        const supabaseAdmin = getSupabaseAdmin();

        // Perform a simple query that should always work if the connection is valid
        // We'll just query the first row from the users table with a limit of 1
        const { count, error } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true })
            .limit(1);

        if (error) {
            console.error('Supabase connection check failed:', error);
            return { isConnected: false, error };
        }

        console.log('Supabase connection successful! Found', count, 'users in database.');
        return { isConnected: true };
    } catch (error) {
        console.error('Error checking Supabase connection:', error);
        return { isConnected: false, error };
    }
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

            // Check Supabase connection
            const { isConnected, error } = await checkSupabaseConnection();
            if (!isConnected) {
                console.error('Failed to connect to Supabase during initialization:', error);
                throw new Error(`Supabase connection failed: ${error?.message || 'Unknown error'}`);
            }

            resources.stripeClient = createStripeClient();

            // Initialize services (in dependency order)
            resources.jwtService = new JwtService();
            resources.tokenService = new TokenService();
            resources.googleAuthService = new GoogleAuthService(resources.encryptionService);
            resources.supabaseAuthService = new SupabaseAuthService(resources.encryptionService);

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
