import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router
  .route('/profile')
  .get(auth(), UserController.getUserProfile)
  .patch(
    auth(),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateProfile(req, res, next);
    }
  );

router
  .route('/')
  .post(
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  )
  .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), UserController.userListForAdmin); 

router.route("/admin")
  .post(auth(USER_ROLES.SUPER_ADMIN),validateRequest(UserValidation.createUserZodSchema), UserController.addAdmin);
router
  .route('/analatycs')
  .get(auth(), UserController.profileAnalatycs);
router.route('/student/:id')
  .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), UserController.getStudentInfo);

// router.route('/couch')
//   .get(auth(USER_ROLES.COUCH), UserController.getCouchProfile
router.get("/couch-analatycs", auth(USER_ROLES.COUCH), UserController.getCouchAnalatycs);

router.route("/:id")
  .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), UserController.lockUnlockUser)

export const UserRoutes = router;
