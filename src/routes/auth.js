import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/auth.js';
import {
  getUserInfoController,
  registerUserController,
  updateAvatarController,
  updateUserInfoController,
} from '../controllers/auth.js';
import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.patch(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updateAvatarController),
);
router.get('/info', authenticate, ctrlWrapper(getUserInfoController));
router.patch('/profile', authenticate, ctrlWrapper(updateUserInfoController));

export default router;
