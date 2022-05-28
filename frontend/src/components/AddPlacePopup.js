import React, { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';

const AddPlacePopup = ({isOpen, onClose, onAddPlace}) => {

  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({name, link})
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
  }

  useEffect( () => {
    setName('');
    setLink('');
  }, [isOpen])

  return (
    <PopupWithForm
      name='add-card'
      title='Новое место'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input 
          value={name}
          onChange={handleChangeName}
          id="placeName" 
          name="name" 
          className="popup__input" 
          type="text" 
          placeholder="Название" 
          minLength="2" 
          maxLength="30"
          required 
        />
        <span className="popup__error placeName-input-error"></span>
      </label>
      <label className="popup__field">
        <input 
          value={link}
          onChange={handleChangeLink}
          id="pictureUrl" 
          name="link" 
          className="popup__input" 
          type="url" 
          placeholder="Ссылка на картинку"
          required 
        />
        <span className="popup__error pictureUrl-input-error"></span>
      </label>
    </PopupWithForm>
  );
};

export default AddPlacePopup;