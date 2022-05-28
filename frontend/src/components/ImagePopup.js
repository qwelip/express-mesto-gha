import React from 'react';

const ImagePopup = ({card, onClose}) => {
  return (
    <div className={ card.isOpened ? `popup popup_type_show-picture popup_opened` : `popup popup_type_show-picture`}>
      <div className="popup__window popup__window_type_picture">
        <button type="button" className="popup__close" onClick={onClose}></button>
        <div className="popup__pictureContainer">
          <img className="popup__img" src={card.link} alt={card.name}/>
        </div>
        <p className="popup__subtitle">{card.name}</p>
      </div>
    </div>
  );
};

export default ImagePopup;