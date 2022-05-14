const Card = require('../models/Card');

const {
  ERROR_VALIDATION,
  ERROR_COMMON,
  LENGTH_OF_ID,
  ERROR_NOT_FOUND,
  ERROR_ACCESS_DENIED,
} = require('../constants/constants');

function getAllCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
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
    res.status(ERROR_VALIDATION).send({ message: 'Передан некорректный id' });
    return;
  }

  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }

      if (req.user._id !== card.owner) {
        res.status(ERROR_ACCESS_DENIED).send({ message: 'Нет прав для удаления чужой карточки' });
        return;
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Передан некорректный id' });
      } else {
        res.status(ERROR_COMMON).send({ message: 'Ошибка сервера' });
      }
    });
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
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send({ data: likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send({ data: likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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
