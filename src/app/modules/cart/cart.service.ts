import { JwtPayload } from "jsonwebtoken";
import { ICart } from "./cart.interface";
import { Cart } from "./cart.model";

const createCartinToDB = async (payload:ICart):Promise<ICart | null>=>{
    const result = await Cart.create(payload)
    return result
}

const getCartFromDB = async(user:JwtPayload)=>{
    const result = await Cart.find({user:user.id}).populate("product").lean()
    const totalPrice = result.reduce((acc,curr:any)=>{
        return acc + curr.product.price * curr.quantity
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
    return result
}
const decreaseCartQuantity = async(id:string)=>{
    const exist = await Cart.findById(id)
    if(exist?.quantity === 1){
        throw new Error("Quantity can't be less than 1")
    }

    const result = await Cart.findByIdAndUpdate(id,{
        $inc:{quantity:-1}
    },{new:true})
    return result
}
export const CartService = {
    createCartinToDB,
    getCartFromDB,
    deleteCartFromDB,
    increaseCartQuantity,
    decreaseCartQuantity

}