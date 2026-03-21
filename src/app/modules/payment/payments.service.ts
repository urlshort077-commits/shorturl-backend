import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import { stripe } from '../../../config/stripe';
import { envVars } from '../../../config/envVars';
import status from 'http-status';
import { Plan } from '../../../../generated/prisma/enums';

const planLimits: Record<Plan, number> = {
    FREE:     10,
    PRO:      500,
    ULTIMATE: 999999,
}

const getPlanPrices = (): Partial<Record<Plan, string>> => ({
    PRO:      envVars.STRIPE_PRO_PRICE_ID,
    ULTIMATE: envVars.STRIPE_ULTIMATE_PRICE_ID,
})

const createCheckoutSession = async (userId: string, plan: 'PRO' | 'ULTIMATE') => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new AppError(status.NOT_FOUND, 'User not found')

    const planPrices = getPlanPrices()
    const priceId    = planPrices[plan]

    console.log(`[Checkout] Plan: ${plan}, PriceID: ${priceId}`)

    if (!priceId) throw new AppError(status.BAD_REQUEST, `Price not configured for: ${plan}`)

    const price = await stripe.prices.retrieve(priceId)
    console.log(`[Checkout] Price type: ${price.type}, active: ${price.active}, currency: ${price.currency}`)

    if (!price.active) {
        throw new AppError(status.BAD_REQUEST, `Price ${priceId} is not active in Stripe`)
    }

    if (price.type === 'recurring') {
        throw new AppError(status.BAD_REQUEST, `Price ${priceId} is recurring — must be one-time`)
    }

    let session
    try {
        session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode:                 'payment',
            line_items: [{
                price:    priceId,
                quantity: 1,
            }],
            metadata: { userId, plan },
            success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${envVars.FRONTEND_URL}/payment/cancel`,
        })
        console.log(`[Checkout] Session created: ${session.id}`)
    } catch (stripeErr: unknown) {
        const e = stripeErr as { message?: string, type?: string, param?: string }
        console.error(`[Checkout] Stripe session error:`, e?.message, `| type: ${e?.type} | param: ${e?.param}`)
        throw new AppError(status.INTERNAL_SERVER_ERROR, e?.message ?? 'Stripe session creation failed')
    }

    return { checkoutUrl: session.url }
}

const handleWebhook = async (payload: Buffer, signature: string) => {
    let event

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            envVars.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        throw new AppError(status.BAD_REQUEST, 'Invalid webhook signature')
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const userId  = session.metadata?.userId
        const plan    = session.metadata?.plan as Plan

        if (!userId || !plan) return

        const payment = await prisma.payments.create({
            data: {
                userId,
                stripeSessionId: session.id,
                stripePaymentId: session.payment_intent as string,
                amount:          (session.amount_total ?? 0) / 100,
                currency:        session.currency ?? 'bdt',
                plan,
            }
        })

        await prisma.subscriptions.update({
            where: { userId },
            data: {
                plan,
                urlLimit:    planLimits[plan],
                urlsCreated: 0,
                lastResetAt: new Date(),
                paymentId:   payment.id,
                purchasedAt: new Date(),
            }
        })

        console.log(`[Webhook] Plan upgraded to ${plan} for user ${userId}`)
    }
}

const getMyPayments = async (userId: string) => {
    return prisma.payments.findMany({
        where:   { userId },
        orderBy: { createdAt: 'desc' }
    })
}

export const paymentService = {
    createCheckoutSession,
    handleWebhook,
    getMyPayments,
}