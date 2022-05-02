const userRouter = require('express').Router();
const {
  getUser,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUser);

userRouter.post('/', createUser);

userRouter.get('/:userId', getUserById);

userRouter.patch('/me', updateProfile);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
