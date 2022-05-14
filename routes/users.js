const userRouter = require('express').Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);

userRouter.get('/:userId', getUserById);

userRouter.get('/me', getCurrentUser);

userRouter.patch('/me', updateProfile);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
