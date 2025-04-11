import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

export async function POST(req: NextRequest) {
    try {
        // This route is public but uses Stripe's webhook signature validation

        // Get the raw request body as text (not JSON parsed)
        const rawBody = await req.text();

        // Get the Stripe signature from headers
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing Stripe signature' },
                { status: 400 }
            );
        }

        // Validate the webhook using Stripe's signature verification
        try {
            const event = stripe.webhooks.constructEvent(
                rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );

            // Process the Stripe event
            switch (event.type) {
                case 'checkout.session.completed':
                    // Handle completed checkout
                    console.log('Checkout completed:', event.data.object);
                    break;

                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                    // Handle subscription events
                    console.log('Subscription event:', event.type, event.data.object);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return NextResponse.json({ received: true });
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Webhook signature verification failed' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
} 