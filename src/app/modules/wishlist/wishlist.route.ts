import express from "express";
import { WishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { WishlistValidation } from "./wishlist.validation";
const router = express.Router();
router.route("/")
    .post(auth(),validateRequest(WishlistValidation.createWishlistZodSchema),WishlistController.createWishlist)
    .get(auth(),WishlistController.getWishlist)
router.route("/:id")
    .delete(auth(),WishlistController.deleteWishlist)

export const WishlistRoutes = router;