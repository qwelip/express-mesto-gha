import React, { useContext } from 'react';
import Card from './Card';
import ImagePopup from './ImagePopup';
import pencilImg from '../images/pencil.svg';
import plusImg from '../images/plus.svg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
 
const Main = ({
    onEditProfile, 
    onAddPlace, 
    onEditAvatar,
    closeAllPopups,
    selectedImgCard,
    cards,
    onCardClick,
    onCardLike,
    onCardDelete
  }) => {

  const {name, about, avatar} = useContext(CurrentUserContext);

  return (
    <>
      <main className="main">
        <section className="profile">
          <div className="profile__photo-edit">
            <button 
              className="profile__pencil"
              onClick={onEditAvatar}
            />
            <div
              className="profile__avatar" 
              style={{backgroundImage: `url(${avatar})`}}
            />
          </div>
          <div className="profile__info">
            <div className="profile__flexRow">
              <h1 className="profile__title">{name}</h1>
              <button
                type="button" 
                className="profile__editProfile"
                onClick={onEditProfile}
              >
                <img src={pencilImg} alt="Иконка карандаша" className="profile__icon"/>
              </button>
            </div>
            <p className="profile__subtitle">{about}</p>
          </div>
          <button 
            type="button" 
            className="profile__addNewCard"
            onClick={onAddPlace}
          >
            <img className="profile__plus" src={plusImg} alt="Иконка плюса"/>
          </button>
        </section>

        <section className="elements">
          {
            cards.map( card => (
                <Card 
                  key={card._id} 
                  onCardClick={onCardClick} 
                  cardId={card._id} 
                  onCardLike={onCardLike}
                  onCardDelete={onCardDelete}
                  {...card}
                />
              )
            )
          }
        </section>
      </main>

      <ImagePopup
        card={selectedImgCard}
        onClose={closeAllPopups}
      />
    </>
  );
};

export default Main;