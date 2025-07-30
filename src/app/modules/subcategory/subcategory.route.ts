import express from "express"
import { SubCategoryController } from "./subcategory.controller";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SubCategoryValidation } from "./subcategory.validation";
import tempAuth from "../../middlewares/tempAuth";
const router = express.Router();
router.route("/")
.get(tempAuth(),SubCategoryController.getAllSubCategory)
.post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(SubCategoryValidation.createSubCategoryZodSchema), SubCategoryController.createSubCategory)
router.route("/:id")
.patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(SubCategoryValidation.createSubCategoryZodSchema), SubCategoryController.updateSubCategory)
.delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), SubCategoryController.deleteSubCategory)
export const SubCategoryRoutes = router;