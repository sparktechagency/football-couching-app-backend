
import z from "zod";

const createWishlistZodSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: 'Product is required',
    }),
  }),
});

export const WishlistValidation = {
  createWishlistZodSchema,
};