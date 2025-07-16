import z from "zod";

const createCourseZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }).optional(),
    image: z.any({
      required_error: "Image is required",
    }),
    startDate: z.string({
      required_error: "Start date is required",
    }),
    endDate: z.string({
      required_error: "End date is required",
    }),
    
  }),
});

export const CourseValidation = {
  createCourseZodSchema,
};