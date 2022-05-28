import React from 'react';
import okImg from '../images/ok.png'
import notOkImg from '../images/not ok.png'

const InfoTooltip = ({state, onClose}) => {

  return (
    <div className={state.isOpen ? "popup popup_opened" : "popup"}>
      <div className="popup__window">
        <button type="button" className="popup__close" onClick={onClose}/>
        <img 
          className='popup__icon' 
          src={state.isError ? notOkImg : okImg} 
          alt={state.isError ? 'Ошибка' : 'Успешно'}  
        />
        <h2 
          className="popup__title popup__title_type_auth"
        >
          {state.isError ? 'Что-то пошло не так! Попробуйте ещё раз.' : 'Вы успешно зарегистрировались!'}
        </h2>
      </div>
    </div>
  );
};

export default InfoTooltip;