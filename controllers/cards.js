const Card = require('../models/Card');

const { LENGTH_OF_ID } = require('../constants/constants');
const { CommonError } = require('../errors/CommonError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ValidationError } = require('../errors/ValidationError');
const { AccessDeniedError } = require('../errors/AccessDeniedError');

const {
  STATUS_CREATED,
  STATUS_OK,
} = require('../constants/constants');

function getAllCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        next(new NotFoundError('Карточки не найдены'));
        return;
      }
      res.send({ data: cards });
    })
    .catch(() => {
      next(new CommonError('Ошибка сервера'));
    });
}

function createCard(req, res, next) {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ owner, name, link })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(new CommonError('Ошибка сервера'));
      }
    });
}

async function deleteCardById(req, res, next) {
  if (req.params.cardId.length < LENGTH_OF_ID) {
    next(new ValidationError('Передан некорректный id'));
    return;
  }

  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (req.user._id !== card.owner.toString()) {
      throw new AccessDeniedError('Нет прав для удаления чужой карточки');
    }

    Card.findByIdAndRemove(req.params.cardId)
      .then(() => {
        res.status(STATUS_OK).send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new ValidationError('Передан некорректный id'));
        } else {
          next(new CommonError('Ошибка сервера'));
        }
      });
  } catch (err) {
    next(err);
  }
}

function addLike(req, res, next) {
  if (req.params.cardId.length < LENGTH_OF_ID) {
    next(new ValidationError('Переданы некорректные данные'));
    return;
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        next(new NotFoundError('Передан несуществующий id карточки'));
        return;
      }
      res.status(STATUS_CREATED).send({ data: likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(new CommonError('Ошибка сервера'));
      }
    });
}

function deleteLike(req, res, next) {
  if (req.params.cardId.length < LENGTH_OF_ID) {
    next(new ValidationError('Переданы некорректные данные'));
    return;
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        next(new NotFoundError('Передан несуществующий id карточки'));
        return;
      }
      res.send({ data: likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(new CommonError('Ошибка сервера'));
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
