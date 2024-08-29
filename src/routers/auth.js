import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  updateAvatarController,
  getProfileInfoController,
  updateProfileInfoController,
  changePasswordController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
} from '../validation/auth.js';
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
  '/password',
  authenticate,
  validateBody(changePasswordSchema),
  ctrlWrapper(changePasswordController),
);
router.patch(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updateAvatarController),
);
router.get('/profile', authenticate, ctrlWrapper(getProfileInfoController));
router.patch(
  '/profile',
  authenticate,
  ctrlWrapper(updateProfileInfoController),
);
export default router;
