const cardsRouter = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);

cardsRouter.post('/', createCard);

cardsRouter.delete('/:cardId', deleteCardById);

cardsRouter.put('/:cardId/likes', addLike);

cardsRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardsRouter;
