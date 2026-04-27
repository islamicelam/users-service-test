import { Router } from 'express';
import { userController } from '../../../composition';
import { authenticate } from '../../../common/middleware/auth.middleware';
import { authorizeRoles } from '../../../common/middleware/authorize-role.middleware';
import { UserRole } from '../enums/user-role.enum';

const router = Router();

router.get(
  '/',
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  userController.findAll,
);

router.get(
  '/:id',
  authenticate,
  userController.findById,
);

router.patch(
  '/:id/block',
  authenticate,
  userController.block,
);

export { router as userRouter };