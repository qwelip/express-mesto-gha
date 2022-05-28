import React, { useContext, useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const EditProfilePopup = ({isOpen, onClose, onUpdateUser}) => {

  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function handleNameChange(e) {
    setName(e.target.value)
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  useEffect(() => {
    setName(currentUser.name || '')
    setDescription(currentUser.about || '')
  }, [currentUser, isOpen])

  return (
    <PopupWithForm
        name='profile-edit'
        title='Редактировать профиль'
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      >
        <label className="popup__field">
          <input
            value={name}
            onChange={handleNameChange}
            id="userName"
            name="name"
            className="popup__input"
            type="text"
            required minLength="2"
            maxLength="40"
            placeholder="Введите имя"
          />
          <span className="popup__error userName-input-error"></span>
        </label>
        <label className="popup__field">
          <input
            value={description}
            onChange={handleDescriptionChange}
            id="userOccupation"
            name="about"
            className="popup__input"
            type="text"
            required minLength="2"
            maxLength="200"
            placeholder="Ваш род деятельности"
          />
          <span className="popup__error userOccupation-input-error"></span>
        </label>
      </PopupWithForm>
  );
};

export default EditProfilePopup;