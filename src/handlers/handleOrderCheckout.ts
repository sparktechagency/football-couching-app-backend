import mongoose from "mongoose";
import Stripe from "stripe";
import { Order, OrderItem } from "../app/modules/order/order.model";
import { Cart } from "../app/modules/cart/cart.model";
import { IProduct, ProductModel } from "../app/modules/product/product.interface";

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
        await Cart.deleteMany({user:order.user}).session(session)
        await Order.findByIdAndUpdate(order._id,{paymentStatus:"paid"}).session(session)
        await session.commitTransaction()
        await session.endSession()
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        console.log(error);
        
    }
}