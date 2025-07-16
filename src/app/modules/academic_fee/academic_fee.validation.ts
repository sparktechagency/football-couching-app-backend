import z from "zod";

const createAcademicFeeZodSchema = z.object({
    body: z.object({
        course: z.string({
            required_error: "Course is required",
        }),
        amount: z.number({
            required_error: "Amount is required",
        }),
    }),
})

export const AcademicFeeValidation = {
  createAcademicFeeZodSchema,
};