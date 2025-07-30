import express from 'express';
import { ProductController } from './product.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import tempAuth from '../../middlewares/tempAuth';
const router = express.Router();
router
  .route('/')
  .get(tempAuth(),ProductController.getAllProduct)
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    fileUploadHandler(),
    validateRequest(ProductValidation.createProductZodSchema),
    ProductController.createProduct
  );
router
  .route('/:id')
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    fileUploadHandler(),
    validateRequest(ProductValidation.updateProductZodSchema),
    ProductController.updateProduct
  )
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ProductController.deleteProduct
  )
  .get(tempAuth(),ProductController.getSingleProduct);
export const ProductRoutes = router;
