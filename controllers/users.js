const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { CommonError } = require('../errors/CommonError');
const { NotFoundError } = require('../errors/NotFoundError');
const { NotValidAuthError } = require('../errors/NotValidAuthError');
const { UnicConflictError } = require('../errors/UnicConflictError');
const { ValidationError } = require('../errors/ValidationError');

const {
  LENGTH_OF_ID,
  PASSWORD_HASH,
  SECRET,
  SEVEN_DAYS,
  STATUS_CREATED,
  STATUS_OK,
} = require('../constants/constants');

function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send({ data: users });
    })
    .catch(() => {
      next(new CommonError('Ошибка сервера'));
    });
}

function createUser(req, res, next) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, PASSWORD_HASH)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          const newUser = user.toObject();
          // eslint-disable-next-line
          delete newUser.password;
          res.status(STATUS_CREATED).send({ data: newUser });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new UnicConflictError('Пользователь с такой почтой уже существует'));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new ValidationError('Переданы некорректные данные'));
          } else {
            next(new CommonError('Ошибка сервера'));
          }
        });
    });
}

function getUserById(req, res, next) {
  if (req.params.userId.length < LENGTH_OF_ID) {
    next(new ValidationError('Переданы некорректные данные'));
    return;
  }
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(new CommonError('Ошибка сервера'));
      }
    });
}

function updateProfile(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(new CommonError('Ошибка сервера'));
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(new CommonError('Ошибка сервера'));
      }
    });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new NotValidAuthError('Вы ввели некорректную почту или пароль');
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new NotValidAuthError('Вы ввели некорректную почту или пароль');
    }

    const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
    res.send({ data: user });
    res.cookie('jwt', token, { maxAge: SEVEN_DAYS, httpOnly: true })
      .end();
  } catch (err) {
    next(err);
  }
}

function getCurrentUser(req, res, next) {
  if (req.params.userId) {
    next();
    return;
  }

  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(new CommonError('Ошибка сервера'));
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
