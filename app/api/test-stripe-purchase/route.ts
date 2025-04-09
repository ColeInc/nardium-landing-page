import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
})

// Website base URL
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Make sure this route is always dynamically rendered
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json()
        const { userId, email, sub } = body

        // Validate required fields
        if (!email || !sub) {
            return NextResponse.json({ message: 'Email and sub ID are required' }, { status: 400 })
        }

        // Create or retrieve a Stripe customer for the user
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
                    userId: userId,
                    sub: sub,
                },
            })
            customerId = newCustomer.id
        }

        // Prepare metadata for Stripe Checkout
        const metadata = {
            userId: userId,
            email: email,
            sub: sub,
            subscription_tier: 'premium'
        }

        // Log the metadata being sent to Stripe
        console.log('Sending metadata to test Stripe Checkout:', JSON.stringify(metadata, null, 2))

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
            metadata: metadata,
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