import z from "zod";

const createProductZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    price: z.string({
      required_error: "Price is required",
    }),
    subcategory: z.string({
      required_error: "Subcategory is required",
    }),
    images: z.any({
      required_error: "Images are required",
    }),
    sizes: z.string({
      required_error: "Sizes are required",
    })
  }),
});

const updateProductZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.string().optional(),
    category: z.string().optional(),
    images: z.any().optional(),
    sizes: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};