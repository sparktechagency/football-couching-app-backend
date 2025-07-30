import express from 'express';
import { SupportController } from './support.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SupportValidation } from './support.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();
router.route("/")
    .post( SupportController.createSupport)
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), SupportController.getSupportMessages)


export const SupportRoutes = router;