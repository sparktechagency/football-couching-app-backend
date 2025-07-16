import z from "zod";

const createSessionZodSchema = z.object({
  body: z.object({
    course: z.string({
      required_error: "Course is required",
    }),
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string().optional(),
    date: z.string({
      required_error: "Date is required",
    }),
    startTime: z.string({
      required_error: "Start time is required",
    }),
    endTime: z.string({
      required_error: "End time is required",
    }),
  }),
});

export const SessionValidation = {
  createSessionZodSchema,
};