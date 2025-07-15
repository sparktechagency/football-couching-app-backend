import z from "zod";

const createCartZodSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: "Product is required",
    }),
    quantity: z.number({
      required_error: "Quantity is required",
    }),
    size: z.array(z.string(), {
      required_error: "Size is required",
    }),
  }),
});

export const CartValidation = {
  createCartZodSchema,
};