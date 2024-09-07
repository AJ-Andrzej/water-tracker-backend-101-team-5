import { Router, json } from 'express';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  updateAvatarController,
  getProfileInfoController,
  updateProfileInfoController,
  requestResetEmailController,
  resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserSchema,
  loginUserSchema,
  updateProfileInfoSchema,
  requestResetEmailSchema, resetPasswordSchema,
  loginWithGoogleOAuthSchema} from '../validation/auth.js';
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
  '/users/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updateAvatarController),
);
authRouter.get(
  '/users/profile',
  authenticate,
  ctrlWrapper(getProfileInfoController),
);
authRouter.patch(
  '/users/update',
  jsonParser,
  authenticate,
  validateBody(updateProfileInfoSchema),
  ctrlWrapper(updateProfileInfoController),
);
authRouter.post(
  '/auth/send-reset-email',
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/auth/reset-password',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
authRouter.get('/auth/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
authRouter.post(
  '/auth/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);
export default authRouter;
