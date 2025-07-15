import express from "express"
import { OrderController } from "./order.controller"
import auth from "../../middlewares/auth"
import { USER_ROLES } from "../../../enums/user"
import validateRequest from "../../middlewares/validateRequest"
import { OrderValidation } from "./order.validation"
const router = express.Router()

router.route("/")
    .get(auth(),OrderController.getOrders)
    .post(auth(),validateRequest(OrderValidation.createOrderZodSchema),OrderController.createOrder)

export const OrderRoutes = router
