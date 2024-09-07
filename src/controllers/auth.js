import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { requestResetToken } from '../services/auth.js';

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  createProfile,
  resetPassword,
  loginOrSignupWithGoogle
} from '../services/auth.js';
import { REFRESH_TOKEN_TTL } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

// registerUserController
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  if (user !== null) {
    const session = await loginUser(req.body);
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.status(201).json({
      accessToken: session.accessToken,
      user,
    });
  }
};

// loginUserController
export const loginUserController = async (req, res) => {
  const user = await UsersCollection.findOne({ email: req.body.email });
  if (user !== null) {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.status(200).json({
      accessToken: session.accessToken,
      user,
    });
  }
};
// logoutUserController
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
};
// refreshUserSessionController
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);
  res.status(200).json({
    accessToken: session.accessToken,
  });
};
// updateAvatarController
export const updateAvatarController = async (req, res) => {
  const userId = req.user._id;
  const user = await UsersCollection.findById(userId);
  const avatar = req.file;

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  let avatarUrl;

  if (avatar) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      avatarUrl = await saveFileToCloudinary(avatar);
    } else {
      avatarUrl = await saveFileToUploadDir(avatar);
    }
  }

  await UsersCollection.findByIdAndUpdate(userId, { photo: avatarUrl });

  res.status(200).json({ message: 'Avatar updated successfully' });
};
// getProfileInfoController
export const getProfileInfoController = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw createHttpError(401, 'User not authenticated');
  }
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  res.status(200).json(user);
};
export const updateProfileInfoController = async (req, res) => {
  const userId = req.user._id;
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const {
    currentPassword,
    newPassword,
    confirmPassword,
    email,
    userName,
    dailyNorma,
    gender,
  } = req.body;

  if (currentPassword) {
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw createHttpError(401, 'Invalid current password');
    }

    if (newPassword !== confirmPassword) {
      throw createHttpError(400, 'New password and confirmation do not match');
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      throw createHttpError(
        400,
        'New password must be different from the current password',
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  if (email && email !== user.email) {
    user.email = email;
  }
  if (userName) {
    user.userName = userName;
  }

  if (dailyNorma) {
    user.dailyNorma = dailyNorma;
  }

  if (gender) {
    user.gender = gender;
  }
  await user.save();

  res.status(200).json(user);
};
// createProfileController
export const createProfileController = async (req, res) => {
  const userId = req.user._id;
  const userData = { ...req.body, userId };

  const user = await createProfile(userData);
  res.status(201).json(user);
};
// requestResetEmailController
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};
// resetPasswordController
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
// getGoogleOAuthUrlController
export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};
// loginWithGoogleController
export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
