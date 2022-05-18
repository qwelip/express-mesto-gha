const { celebrate, Joi } = require('celebrate');
const cardsRouter = require('express').Router();

// eslint-disable-next-line
const urlRegExp = new RegExp('^(https?:)\/\/(www.)?[a-z0-9./_~:/?#@!$&()*+,;=\\]\\[-]+#?$');

const {
  getAllCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegExp),
  }),
}), createCard);

cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .required()
      .alphanum()
      .length(24)
      .hex(),
  }),
}), deleteCardById);

cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .required()
      .alphanum()
      .length(24)
      .hex(),
  }),
}), addLike);

cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .required()
      .alphanum()
      .length(24)
      .hex(),
  }),
}), deleteLike);

module.exports = cardsRouter;
