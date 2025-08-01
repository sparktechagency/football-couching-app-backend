import { Request, Response } from "express"
import config from "../config"
import Stripe from "stripe"
import { handleOrderCheckout } from "../handlers/handleOrderCheckout"
import { stripe } from "../config/stripe"
import { AcademicFeeService } from "../app/modules/academic_fee/academic_fee.service"
import { handleSubscriptionCreated } from "../handlers/handleSubscritionCreated"

export const handleStripeWebhook = async (req:Request,res:Response) => {
    const sig = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(req.body,sig!,config.stripe.webhook_secret!)
    switch (event.type) {
        case 'checkout.session.completed':
            console.log(event);
            
            const metadata = event.data.object.metadata
            if(metadata?.orderId){
            handleOrderCheckout(event.data.object)
            }
            else if(metadata?.feeId){
                await AcademicFeeService.confirmPayment(metadata.feeId,(event.data.object.invoice as any as string)||"")
            }

            break;
        
        case "customer.subscription.created":
            await handleSubscriptionCreated(event.data.object)

        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).json({received:true})
}