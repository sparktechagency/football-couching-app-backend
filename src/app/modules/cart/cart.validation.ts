import z from "zod";

const createCartZodSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: "Product is required",
    }),
    quantity: z.string({
      required_error: "Quantity is required",
    }),
    size: z.string(),
  })
});

export const CartValidation = {
  createCartZodSchema,
};