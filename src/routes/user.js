// import { Router } from 'express';
import {
  getProfileInfoController,
  updateAvatarController,
  updateProfileInfoController,
} from '../controllers/auth';
import { authenticate } from '../middlewares/authenticate';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import { upload } from '../middlewares/multer';
import router from '.';
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
