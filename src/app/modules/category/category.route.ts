import express from "express"
import { CategoryController } from "./category.controller";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";
import fileUploadHandler from "../../middlewares/fileUploadHandler";

const router = express.Router();

router.route("/")
.get(CategoryController.getAllCategory)
.post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(CategoryValidation.createCategoryZodSchema), CategoryController.createCategory)

router.route("/:id")
.patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(CategoryValidation.updateCategoryZodSchema), CategoryController.updateCategory)
.delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), CategoryController.deleteCategory)


export const CategoryRoutes = router;