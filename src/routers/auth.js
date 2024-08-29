import { Router, json } from 'express';
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
const authRouter = Router();
const jsonParser = json();

authRouter.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

authRouter.patch(
  '/password',
  authenticate,
  jsonParser,
  validateBody(changePasswordSchema),
  ctrlWrapper(changePasswordController),
);
authRouter.patch(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updateAvatarController),
);
authRouter.get('/profile', authenticate, ctrlWrapper(getProfileInfoController));
authRouter.patch(
  '/profile',
  jsonParser,
  authenticate,
  ctrlWrapper(updateProfileInfoController),
);
export default authRouter;
