const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const { URL_REG_STR } = require('../constants/constants');

const urlRegExp = new RegExp(`${URL_REG_STR}`);

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
    userId: Joi
      .string()
      .required()
      .alphanum()
      .length(24)
      .hex(),
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
