import express from "express"
import { USER_ROLES } from "../../../enums/user"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { DisclaimerController } from "./disclaimer.controller"
import { DisclaimerValidation } from "./disclaimer.validation"
const router = express.Router()

router.route("/")
.post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(DisclaimerValidation.createDisclaimerZodSchema),DisclaimerController.createDisclaimer)
.get(validateRequest(DisclaimerValidation.getAllDisclaimerZodSchema),DisclaimerController.getAllDisclaimer)

export const DisclaimerRoute = router