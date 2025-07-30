import express from "express"
import { SubmissionController } from "./submission.controller"
import auth from "../../middlewares/auth"
import { USER_ROLES } from "../../../enums/user"
import validateRequest from "../../middlewares/validateRequest"
import multer from "multer"
const upload = multer({
  dest: 'uploads/chunks/', // Save each chunk here temporarily
});
const router = express.Router()
router.post(
  "/",
  auth(USER_ROLES.MEMBER),
  SubmissionController.createSubmit
)

router.route("/:id").get(auth(USER_ROLES.COUCH),SubmissionController.getSubmissionById)
export const SubmissionRoutes = router