import e from "cors";
import z from "zod";

const createEnrollZodSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: "User is required",
    }),
    course: z.string({
      required_error: "Course is required",
    }),
  }),
});

export const EnrollValidation = {
  createEnrollZodSchema,
};