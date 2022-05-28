import React from 'react';

const PopupWithForm = ({name, title, children, isOpen, onClose, onSubmit}) => {
  return (
    <div className={ isOpen ? `popup popup_type_${name} popup_opened` : `popup popup_type_${name}`}>
      <div className="popup__window">
        <button type="button" className="popup__close" onClick={onClose}/>
        <h2 className="popup__title">{title}</h2>
        <form onSubmit={onSubmit} className="popup__form" name={name} action="#" noValidate>
          {children}
          <button className="popup__submitBtn" type="submit">Сохранить</button>
        </form>
      </div>
    </div>
  );
};

export default PopupWithForm;