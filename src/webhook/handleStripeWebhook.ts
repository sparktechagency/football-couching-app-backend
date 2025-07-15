import { Request, Response } from "express"
import config from "../config"
import Stripe from "stripe"
import { handleOrderCheckout } from "../handlers/handleOrderCheckout"
import { stripe } from "../config/stripe"

export const handleStripeWebhook = async (req:Request,res:Response) => {
    const sig = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(req.body,sig!,config.stripe.webhook_secret!)
    switch (event.type) {
        case 'checkout.session.completed':
            handleOrderCheckout(event.data.object)
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).json({received:true})
}