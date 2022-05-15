const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();

// eslint-disable-next-line
const urlRegExp = new RegExp('https?:\/\/.+');

// eslint-disable-next-line
const userIdRegExp = new RegExp('[a-z0-9]{24}');

const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().pattern(userIdRegExp),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp),
  }),
}), updateAvatar);

module.exports = userRouter;
