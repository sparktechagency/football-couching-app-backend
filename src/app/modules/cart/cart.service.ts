import { JwtPayload } from "jsonwebtoken";
import { ICart } from "./cart.interface";
import { Cart } from "./cart.model";
import { IProduct } from "../product/product.interface";

const createCartinToDB = async (payload:ICart):Promise<ICart | null>=>{
    const result = await Cart.create(payload)
    return result
}

const getCartFromDB = async(user:JwtPayload)=>{
    const result = await Cart.find({user:user.id}).populate("product").lean()
    const totalPrice = result.reduce((acc,curr:any)=>{
        return acc + curr.product?.price * curr.quantity
    },0)
    const deliveryCharge = 67
    return {result,totalPrice,deliveryCharge}
}

const deleteCartFromDB = async(id:string)=>{
    const result = await Cart.findByIdAndDelete(id)
    return result
}

const increaseCartQuantity = async(id:string)=>{
    const result = await Cart.findByIdAndUpdate(id,{
        $inc:{quantity:1}
    },{new:true})
    return result?.quantity
}
const decreaseCartQuantity = async(id:string)=>{
    const exist = await Cart.findById(id)
    if(exist?.quantity === 1){
        throw new Error("Quantity can't be less than 1")
    }

    const result = await Cart.findByIdAndUpdate(id,{
        $inc:{quantity:-1}
    },{new:true})
    return result?.quantity
}



const checkOutDataOfUserFromDB = async(user:JwtPayload)=>{
    let result = await Cart.find({user:user.id}).populate("product","title images price").lean()
    const subtotal = result.reduce((acc,curr)=>{
        const product = curr.product as any as IProduct
        return acc + product.price * curr.quantity
    },0)

    const modifiedOrders = result.map((item)=>{
        const product = item.product as any as IProduct
        return {
            price:product.price*item.quantity,
            image:product.images[0],
            quantity:item.quantity,
            name:product.title,
            size:item.size,
            productPrice : product.price,
            
        }
    })
    const deliveryCharge = 67
    const totalPrice = subtotal + deliveryCharge
    return {products:modifiedOrders,totalPrice,subtotal,deliveryCharge}
}
export const CartService = {
    createCartinToDB,
    getCartFromDB,
    deleteCartFromDB,
    increaseCartQuantity,
    decreaseCartQuantity,
    checkOutDataOfUserFromDB

}