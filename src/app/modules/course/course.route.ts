import express from 'express';
import { CourseController } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidation } from './course.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();
router.route("/")
 .post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(CourseValidation.createCourseZodSchema),CourseController.createCourse)
 .get(auth(),CourseController.getAllCourses)
router.get("/course-overview/:id",auth(USER_ROLES.COUCH),CourseController.getSingleCourseOverview)
router.route("/student-course")
 .get(auth(USER_ROLES.MEMBER),CourseController.getStudentsCourses)
router.get("/manage-class/:id",auth(USER_ROLES.COUCH,USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),CourseController.manageClassForCouch)
 router.get("/student-course-list",auth(USER_ROLES.MEMBER),CourseController.getStudentCourseList)
router.route("/:id")
 .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),CourseController.updateCourse)
 .delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),CourseController.deleteCourse)
 .get(auth(),CourseController.getCourseHistoryForStudent)


 export const CourseRoutes = router;