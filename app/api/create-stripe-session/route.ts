import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
})

// Initialize Supabase admin client (for server-side)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || '' // You'll need to add this to your .env files
)

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
        const { userId, email } = body

        // Verify that the token's user ID matches the requested user ID
        if (user.id !== userId) {
            return NextResponse.json({ message: 'User ID mismatch' }, { status: 403 })
        }

        // Create or retrieve a Stripe customer
        let customerId: string

        // Search for existing customer
        const existingCustomers = await stripe.customers.list({
            email: email,
            limit: 1,
        })

        if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id
        } else {
            // Create a new customer
            const newCustomer = await stripe.customers.create({
                email: email,
                metadata: {
                    supabaseUserId: userId,
                },
            })
            customerId = newCustomer.id
        }

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Nardium Premium Subscription',
                            description: 'Full access to all Nardium features',
                        },
                        unit_amount: 999, // $9.99
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/`,
            metadata: {
                supabaseUserId: userId,
            },
        })

        return NextResponse.json({ checkoutUrl: session.url })

    } catch (error) {
        console.error('Error creating checkout session:', error)
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'An error occurred' },
            { status: 500 }
        )
    }
} 