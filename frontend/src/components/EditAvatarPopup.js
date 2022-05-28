import React, { useEffect, useRef } from 'react';
import PopupWithForm from './PopupWithForm';

const EditAvatarPopup = ({isOpen, onClose, onUpdateAvatar}) => {

  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  useEffect(() => {
    inputRef.current.value = '';
  }, [isOpen])

  return (
    <PopupWithForm
        name='edit-avatar'
        title='Обновить аватар'
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      >
        <label className="popup__field">
          <input 
            ref={inputRef}
            id="avatarPicture" 
            name="avatarPicture" 
            className="popup__input popup__input_type_edit-avatar" 
            placeholder="Ссылка на картинку" 
            type="url" 
            required
          />
          <span className="popup__error avatarPicture-input-error"></span>
        </label>
      </PopupWithForm>
  );
};

export default EditAvatarPopup;