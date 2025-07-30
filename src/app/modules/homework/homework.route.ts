import express from "express";
import { HomeworkController } from "./homework.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { HomeworkValidation } from "./homework.validation";
const router = express.Router();
router.route("/")
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.COUCH),HomeworkController.getAllHomeWork)
    .post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.COUCH),validateRequest(HomeworkValidation.createHomeWorkZodSchema),HomeworkController.createHomeWork)

router.route("/:id")
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.COUCH),HomeworkController.getSingleHomeWork)
    .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.COUCH),validateRequest(HomeworkValidation.updateHomeWorkZodSchema),HomeworkController.updateHomeWork)
    .delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.COUCH),HomeworkController.deleteHomeWork)

export const HomeworkRoutes = router;
