import z from "zod";

const createTopicZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    image: z.any({
      required_error: "Image is required",
    }),
  }),
});


export const TopicValidation = {
  createTopicZodSchema,
};