import z from "zod";

const createDisclaimerZodSchema = z.object({
    body:z.object({
        content:z.string({
            required_error:"Content is required"
        }),
        type:z.enum(["about","terms","support"],{
            required_error:"Type is required"
        })
    })
})

const getAllDisclaimerZodSchema = z.object({
    query:z.object({
        type:z.enum(["about","terms","support"],{
            required_error:"Type is required"
        })
    })
})

export const DisclaimerValidation = {
    createDisclaimerZodSchema,
    getAllDisclaimerZodSchema
}