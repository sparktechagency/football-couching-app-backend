import express from "express";
import { AcademicFeeController } from "./academic_fee.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFeeValidation } from "./academic_fee.validation";
import { USER_ROLES } from "../../../enums/user";
const router = express.Router();
router.route("/")
  .post(auth(USER_ROLES.MEMBER),validateRequest(AcademicFeeValidation.createAcademicFeeZodSchema), AcademicFeeController.createAcademicFee)
  .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.MEMBER), AcademicFeeController.getAllAcademicFees)
export const AcademicFeeRoutes = router;