const User = require('../models/User');

const ERROR_VALIDATION = 400;
const ERROR_COMMON = 500;
const ERROR_NOT_FOUND = 404;

function getAllUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function getUserById(req, res) {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      } if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      } if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
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
};
