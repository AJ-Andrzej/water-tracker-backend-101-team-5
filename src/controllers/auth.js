import bcrypt from 'bcrypt';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  createProfile,
} from '../services/auth.js';
import { REFRESH_TOKEN_TTL } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
// registerUserController
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
// loginUserController
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
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
    expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
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
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
// updateAvatarController
export const updateAvatarController = async (req, res) => {
  const userId = req.user._id;
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  let avatarUrl;

  if (req.file) {
    avatarUrl = await saveFileToUploadDir(req.file);
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
  res.status(200).json({
    status: 200,
    message: 'User info retrieved successfully',
    data: user,
  });
};
// updateProfileInfoController
export const updateProfileInfoController = async (req, res) => {
  const userId = req.user._id;
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const allowedFields = ['name', 'gender', 'dailyNorma', 'password'];
  const fieldsToUpdate = {};

  Object.keys(req.body).forEach((field) => {
    if (allowedFields.includes(field)) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw createHttpError(400, 'No valid fields to update');
  }

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { $set: fieldsToUpdate },
    { new: true },
  );
  res.status(200).json({
    status: 200,
    message: 'User profile updated successfully',
    data: updatedUser,
  });
};
// changePasswordController
export const changePasswordController = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw createHttpError(400, 'All fields are required');
  }

  if (newPassword !== confirmPassword) {
    throw createHttpError(400, 'New password and confirmation do not match');
  }

  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw createHttpError(401, 'Invalid current password');
  }

  const isNewPasswordDifferent = newPassword !== currentPassword;

  if (!isNewPasswordDifferent) {
    throw createHttpError(
      400,
      'New password must be different from current password',
    );
  }

  const encryptedNewPassword = await bcrypt.hash(newPassword, 10);

  await UsersCollection.findByIdAndUpdate(userId, {
    password: encryptedNewPassword,
  });

  res.status(200).json({ message: 'Password changed successfully' });
};
// createProfileController
export const createProfileController = async (req, res) => {
  const userId = req.user._id;
  const userData = { ...req.body, userId };

  const user = await createProfile(userData);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a user!',
    data: user,
  });
};
