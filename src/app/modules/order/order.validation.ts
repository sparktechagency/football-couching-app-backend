import z from "zod";
import { ORDER_STATUS } from "../../../enums/order";

const createOrderZodSchema = z.object({
    body:z.object({
        address:z.string({
            required_error:"Address is required"
        }),
        phone:z.string({
            required_error:"Phone is required"
        }),
        code:z.string({
            required_error:"Code is required"
        }).optional()
    })
})

const changeOrderStatusZodSchema = z.object({
    body:z.object({
        status:z.nativeEnum(ORDER_STATUS)
    })
})

export const OrderValidation = {
    createOrderZodSchema,
    changeOrderStatusZodSchema
}