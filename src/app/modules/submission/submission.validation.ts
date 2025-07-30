import z from "zod";

const createSubmissionZodSchema = z.object({
    body:z.object({
        homework:z.string({
            required_error:"Homework is required"
        }),
        video:z.string({
            required_error:"Video is required"
        }),
        statement:z.string().optional()
    })
})

export const SubmissionValidation = {
    createSubmissionZodSchema
}