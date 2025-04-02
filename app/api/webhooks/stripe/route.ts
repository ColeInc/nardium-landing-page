import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
})

// Initialize Supabase admin client (for server-side operations)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || '' // You'll need to add this to your .env files
)

export async function POST(request: Request) {
    const body = await request.text()
    const signature = headers().get('stripe-signature') || ''

    let event: Stripe.Event

    try {
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        console.error('Webhook signature verification failed:', error)
        return NextResponse.json(
            { message: 'Webhook signature verification failed' },
            { status: 400 }
        )
    }

    // Handle specific event types
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session
            await handleCompletedCheckout(session)
        } else if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object as Stripe.Subscription
            await handleSubscriptionUpdate(subscription)
        } else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription
            await handleSubscriptionCancellation(subscription)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Error handling webhook event:', error)
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'An error occurred' },
            { status: 500 }
        )
    }
}

// Helper functions for handling different webhook events

async function handleCompletedCheckout(session: Stripe.Checkout.Session) {
    // Get the user ID from the session metadata
    const userId = session.metadata?.supabaseUserId

    if (!userId) {
        console.error('No user ID found in session metadata')
        return
    }

    // Update the user's tier in Supabase
    const { error } = await supabaseAdmin
        .from('users')
        .update({ tier: 'subscriber' })
        .eq('id', userId)

    if (error) {
        console.error('Error updating user tier:', error)
        throw error
    }

    console.log(`User ${userId} upgraded to subscriber tier`)
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    // Get the customer ID from the subscription
    const customerId = subscription.customer as string

    // Retrieve the customer to get the user ID from metadata
    const customer = await stripe.customers.retrieve(customerId)

    if (!customer || customer.deleted) {
        console.error('Customer not found or deleted')
        return
    }

    const userId = customer.metadata?.supabaseUserId

    if (!userId) {
        console.error('No user ID found in customer metadata')
        return
    }

    // Determine the user's tier based on the subscription status
    let tier = 'free'

    if (subscription.status === 'active' || subscription.status === 'trialing') {
        tier = 'subscriber'
    }

    // Update the user's tier in Supabase
    const { error } = await supabaseAdmin
        .from('users')
        .update({ tier })
        .eq('id', userId)

    if (error) {
        console.error('Error updating user tier:', error)
        throw error
    }

    console.log(`User ${userId} subscription updated, new tier: ${tier}`)
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
    // Get the customer ID from the subscription
    const customerId = subscription.customer as string

    // Retrieve the customer to get the user ID from metadata
    const customer = await stripe.customers.retrieve(customerId)

    if (!customer || customer.deleted) {
        console.error('Customer not found or deleted')
        return
    }

    const userId = customer.metadata?.supabaseUserId

    if (!userId) {
        console.error('No user ID found in customer metadata')
        return
    }

    // Update the user's tier in Supabase to free
    const { error } = await supabaseAdmin
        .from('users')
        .update({ tier: 'free' })
        .eq('id', userId)

    if (error) {
        console.error('Error updating user tier:', error)
        throw error
    }

    console.log(`User ${userId} subscription cancelled, downgraded to free tier`)
} 