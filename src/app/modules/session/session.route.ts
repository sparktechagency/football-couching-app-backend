import express from 'express';
import { SessionController } from './session.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { SessionValidation } from './session.validation';
const router = express.Router();
router.route("/")
 .post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(SessionValidation.createSessionZodSchema),SessionController.createSession)
 .get(auth(),SessionController.getAllSessions)
 router.route("/:id")
 .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(SessionValidation.createSessionZodSchema),SessionController.updateSession)
 .delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),SessionController.deleteSession)

 export const SessionRoutes = router;