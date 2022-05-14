const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {
  ERROR_VALIDATION,
  ERROR_COMMON,
  LENGTH_OF_ID,
  ERROR_NOT_FOUND,
  ERROR_NOT_VALID_AUTH,
  ERROR_UNIQ_STRING_CONFLICT,
} = require('../constants/constants');

function getAllUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
    });
}

function createUser(req, res) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        hash,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.code === 11000) {
            res.status(ERROR_UNIQ_STRING_CONFLICT).send({ message: 'Пользователь с такой почтой уже существует' });
            return;
          }
          if (err.name === 'ValidationError') {
            res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
          } else {
            res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
          }
        });
    });
}

function getUserById(req, res) {
  if (req.params.userId.length < LENGTH_OF_ID) {
    res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
    return;
  }
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function login(req, res) {
  const { email, password } = req.body;
  let user;

  User.findOne({ email }).select('+password')
    .then((findUser) => {
      if (!findUser) {
        res.status(ERROR_NOT_VALID_AUTH).send({ message: 'Вы ввели некорректную почту или пароль' });
        return;
      }
      user = findUser;
      bcrypt.compare(password, user.password); // todo убрал здесь return может зря
    })
    .then((matched) => {
      if (!matched) {
        res.status(ERROR_NOT_VALID_AUTH).send({ message: 'Вы ввели некорректную почту или пароль' });
        return;
      }
      const token = jwt.sign({ _id: user._id }, 'SECRET', { expiresIn: '7d' }); // todo засекретить пароль, вынести в переменную

      res.cookie('jwt', token, { maxAge: 604800000, httpOnly: true })
        .end();
    });
}

function getCurrentUser(req, res) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
