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

router.route("/upcomming-couch")
 .get(auth(USER_ROLES.COUCH),SessionController.upcommingSessionsForCouch)
router.route("/upcomming")
 .get(auth(),SessionController.upcommingSession)
router.route("/upcomming-toady")
 .get(auth(),SessionController.upcommingSessionsOfToady)
 router.route("/:id")
 .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),SessionController.updateSession)
 .delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),SessionController.deleteSession)
 .get(auth(),SessionController.getSessionDetails)
 export const SessionRoutes = router;