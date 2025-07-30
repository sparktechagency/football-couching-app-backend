import express from 'express';
import { TopicController } from './topic.controller';
import validateRequest from '../../middlewares/validateRequest';
import { TopicValidation } from './topic.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();

router.route("/")
.post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(TopicValidation.createTopicZodSchema),TopicController.createTopic)

.get(TopicController.getTopics)
router.route("/:id")
.patch(fileUploadHandler(),auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(TopicValidation.createTopicZodSchema),TopicController.updateTopic)
.delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),TopicController.deleteTopic)
export const TopicRoutes = router;