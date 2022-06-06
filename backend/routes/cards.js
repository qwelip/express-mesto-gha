const { celebrate, Joi } = require('celebrate');
const cardsRouter = require('express').Router();
const { URL_REG_STR } = require('../constants/constants');

const urlRegExp = new RegExp(URL_REG_STR, 'g');

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
