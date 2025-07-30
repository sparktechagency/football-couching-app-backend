import express from 'express';
import { CartController } from './cart.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { CartValidation } from './cart.validation';
const router = express.Router();
router.route("/")
    .post(auth(),validateRequest(CartValidation.createCartZodSchema),CartController.createCart)
    .get(auth(),CartController.getCart)

router.get("/checkout",auth(),CartController.getCheckoutData)
router.route("/:id")
    .delete(auth(),CartController.deleteCart)
    .patch(auth(),CartController.increaseCartQuantity)
    .put(auth(),CartController.decreaseCartQuantity)

export const CartRoutes = router;