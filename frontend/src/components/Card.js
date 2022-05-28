import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import trashImg from '../images/Trash.svg';

const Card = ({
    link, 
    name, 
    likes, 
    cardId, 
    onCardClick,
    onCardLike, 
    onCardDelete,
    owner
  }) => {

  const {_id} = useContext(CurrentUserContext);
  const isLiked = likes ? likes.some( i => i._id === _id) : false;

  function handleLikeClick() {
    onCardLike({likes, cardId});
  }

  function handleDeleteClick() {
    onCardDelete(cardId);
  }

  return (
    <div className="element">
      {
        owner._id === _id &&
        <button type="button" className="element__trashBtn">
          <img 
            src={trashImg} 
            alt="Иконка корзины"
            onClick={handleDeleteClick}
          />
        </button>
      }
      <div 
        className="element__photo" 
        style={{backgroundImage: `url(${link})`}}
        onClick={() => onCardClick({link, name})}
      />
      <div className="element__description">
        <h2 className="element__title">{name}</h2>
        <div className="element__like-section">
          <button 
            type="button" 
            onClick={handleLikeClick}
            className={ isLiked ? "element__likeBtn element__likeBtn_cheked" : "element__likeBtn"}
          ></button>
          <p className="element__like-count">{likes ? likes.length : 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;