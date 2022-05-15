const { celebrate, Joi } = require('celebrate');
const cardsRouter = require('express').Router();

// eslint-disable-next-line
const urlRegExp = new RegExp('https?:\/\/.+');

// eslint-disable-next-line
const cardIdRegExp = new RegExp('[a-z0-9]{24}');

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
    cardId: Joi.string().required().pattern(cardIdRegExp),
  }),
}), deleteCardById);

cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(cardIdRegExp),
  }),
}), addLike);

cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(cardIdRegExp),
  }),
}), deleteLike);

module.exports = cardsRouter;
