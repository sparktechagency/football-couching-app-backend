import express from "express";
import { PerformanceController } from "./performance.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PerformanceValidation } from "./performance.validation";
const router = express.Router();
router.route("/")
    .post(auth(),validateRequest(PerformanceValidation.createPerformanceZodSchema),PerformanceController.createPerformance)

router.route("/student")
    .get(auth(),PerformanceController.getStudentPerformance)
router.route('/student-mark')
    .get(auth(),PerformanceController.getPerformance)
    .post(auth(),PerformanceController.giveMarks)
router.route("/:id")
    .get(auth(),PerformanceController.getStudentListOFCourse)



export const PerformanceRoutes = router;