import express from 'express';
import { EnrollController } from './enroll.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { EnrollValidation } from './enroll.validaiton';
const router = express.Router();
router.route("/")
  .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),validateRequest(EnrollValidation.createEnrollZodSchema), EnrollController.createEnroll)
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), EnrollController.getAllEnroll);

router.route("/:id")
  .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),validateRequest(EnrollValidation.createEnrollZodSchema), EnrollController.updateEnroll)
  .delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), EnrollController.deleteEnroll)
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN,USER_ROLES.COUCH), EnrollController.getStudentBasedOnCourse);

export const EnrollRoutes = router;