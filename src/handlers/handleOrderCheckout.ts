import mongoose from "mongoose";
import Stripe from "stripe";
import { Order, OrderItem } from "../app/modules/order/order.model";
import { Cart } from "../app/modules/cart/cart.model";
import { IProduct, ProductModel } from "../app/modules/product/product.interface";
import { Coupon } from "../app/modules/coupon/coupon.model";
import { sendAdminNotifications, sendNotifications } from "../helpers/notificationHelper";
import { stripe } from "../config/stripe";

export const handleOrderCheckout = async (data:Stripe.Checkout.Session) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const order = await Order.findById(data.metadata?.orderId).session(session).lean()
        if(!order){
            console.log("Order not found")
            return
        }
        const cart = await Cart.find({user:order.user}).populate('product').session(session).lean()
        
        if(!cart.length){
            console.log("Cart not found")
            return
        }

        const sessionData = await stripe.checkout.sessions.retrieve(data.id, {
            expand:['invoice','payment_intent']
        })

        const invoiceLink =(sessionData.invoice as any as Stripe.Invoice).invoice_pdf
        
        
        
        for (const item of cart) {
            const product = item.product as any
            (await OrderItem.create({
                product:product._id,
                quantity:item.quantity,
                size:item.size,
                price:product.price,
                name:product.title,
                image:product.images[0],
                order:order._id
            })).$session(session)
            // console.log(product);
            
            
        }
         if(order.code){
               await Coupon.updateOne({code:order.code},{
      $push:{
        users:order.user
      }
    },{session:session});
         }
        await Cart.deleteMany({user:order.user}).session(session)
        await Order.findByIdAndUpdate(order._id,{paymentStatus:"paid",invoice:invoiceLink}).session(session)
        await sendNotifications({
            title:"Order Placed",
            body:`Your order ${order.orderid} has been placed successfully`,
            reciever:[order.user],
            path:"order",
            referenceId:order._id
        })
        await sendAdminNotifications({
            title:"New Order Placed",
            body:`New order ${order.orderid} has been placed successfully`,
            reciever:[],
            path:"order",
            referenceId:order._id
        })
        await session.commitTransaction()
        await session.endSession()
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        console.log(error);
        
    }
}