import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
})

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json()
        const { userId, email, sub } = body

        // Validate required fields
        if (!email || !sub) {
            return NextResponse.json({ message: 'Email and sub ID are required' }, { status: 400 })
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
        console.log('Sending metadata to Stripe Checkout:', JSON.stringify(metadata, null, 2))

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
            metadata: metadata,
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