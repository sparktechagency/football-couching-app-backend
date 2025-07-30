import z from "zod";

const createHomeWorkZodSchema = z.object({
    body:z.object({
        session:z.string({required_error:'Session is required'}),
        title:z.string({required_error:'Title is required'}),
        description:z.string({required_error:'Description is required'}),
    })
})
const updateHomeWorkZodSchema = z.object({
    body:z.object({
        course:z.string().optional(),
        session:z.string().optional(),
        title:z.string().optional(),
        description:z.string().optional(),
    })
})
export const HomeworkValidation = {
    createHomeWorkZodSchema,
    updateHomeWorkZodSchema
}