import z from "zod";

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

export const OrderValidation = {
    createOrderZodSchema
}