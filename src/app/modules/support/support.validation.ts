import z from "zod";

const createSupportZodSchema = z.object({
    email: z.string().email(),
    opinion: z.string().min(1),
})

export const SupportValidation = {
    createSupportZodSchema
}