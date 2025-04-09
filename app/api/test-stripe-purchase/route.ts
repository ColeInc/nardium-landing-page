import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
})

// Initialize Supabase admin client (for server-side operations)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Website base URL
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Make sure this route is always dynamically rendered
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        // Get bearer token from request headers
        const authHeader = request.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const accessToken = authHeader.split(' ')[1]

        // Verify the token with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken)

        if (error || !user) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const { userId } = body

        // Verify that the token's user ID matches the requested user ID
        if (user.id !== userId) {
            return NextResponse.json({ message: 'User ID mismatch' }, { status: 403 })
        }

        // Create or retrieve a Stripe customer for the user
        let customerId: string

        // Search for existing customer
        const existingCustomers = await stripe.customers.list({
            email: user.email,
            limit: 1,
        })

        if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id
        } else {
            // Create a new customer
            const newCustomer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabaseUserId: userId,
                },
            })
            customerId = newCustomer.id
        }

        // For testing purposes, create a checkout session with a test price
        // In production, you would use actual product/price IDs from your Stripe dashboard
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Nardium Premium Subscription (Test)',
                            description: 'Full access to all Nardium features',
                        },
                        unit_amount: 100, // $1.00 for testing
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/`,
            metadata: {
                supabaseUserId: userId,
            },
        })

        return NextResponse.json({
            success: true,
            checkoutUrl: session.url,
            message: 'Checkout session created successfully'
        })

    } catch (error) {
        console.error('Error creating checkout session:', error)
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'An error occurred' },
            { status: 500 }
        )
    }
} 