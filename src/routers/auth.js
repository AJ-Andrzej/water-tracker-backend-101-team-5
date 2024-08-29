import { Router, json } from 'express';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  updateAvatarController,
  getProfileInfoController,
  updateProfileInfoController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserSchema,
  loginUserSchema,
  // changePasswordSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
const authRouter = Router();
const jsonParser = json();

authRouter.post(
  '/auth/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/auth/login',
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/auth/logout', ctrlWrapper(logoutUserController));
authRouter.post('/auth/refresh', ctrlWrapper(refreshUserSessionController));

authRouter.patch(
  '/auth/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updateAvatarController),
);
authRouter.get(
  '/auth/profile',
  authenticate,
  ctrlWrapper(getProfileInfoController),
);
authRouter.patch(
  '/auth/profile',
  jsonParser,
  authenticate,
  ctrlWrapper(updateProfileInfoController),
);
export default authRouter;
