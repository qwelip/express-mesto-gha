const Card = require('../models/Card');

const ERROR_VALIDATION = 400;
const ERROR_COMMON = 500;
const ERROR_NOT_FOUND = 404;
const LENGTH_OF_ID = 24;

function getAllCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function createCard(req, res) {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ owner, name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function deleteCardById(req, res) {
  if (req.params.cardId.length < LENGTH_OF_ID) {
    res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
    return;
  }
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error());
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' }));
}

function addLike(req, res) {
  if (req.params.cardId.length < LENGTH_OF_ID) {
    res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
    return;
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        return Promise.reject(new Error('CastError'));
      }
      return res.send({ data: likes });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
        return;
      } if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

function deleteLike(req, res) {
  if (req.params.cardId.length < LENGTH_OF_ID) {
    res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
    return;
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        return Promise.reject(new Error('CastError'));
      }
      return res.send({ data: likes });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
        return;
      } if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
