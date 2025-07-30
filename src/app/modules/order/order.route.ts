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

router.route("/:id")
    .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(OrderValidation.changeOrderStatusZodSchema),OrderController.changeOrderStatus)
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),OrderController.getOrder)

export const OrderRoutes = router
