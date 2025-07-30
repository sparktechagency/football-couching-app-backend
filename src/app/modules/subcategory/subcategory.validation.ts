import z from "zod";

const createSubCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    category: z.string({
      required_error: "Category is required",
    }),
  }),
});

export const SubCategoryValidation = {
  createSubCategoryZodSchema,
};

