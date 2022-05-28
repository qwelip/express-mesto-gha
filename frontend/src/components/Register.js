import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({registration}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  function onRegister(e) {
    e.preventDefault();
    registration(password, email);
    clearInputs();
  }

  return (
    <section className='login-signup'>
      <div className="login-signup__wrapper">
        <h1 className='login-signup__title'>Регистрация</h1>
        <form onSubmit={onRegister} action="#">
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className='login-signup__input' 
            placeholder='Email' 
            type="text" 
            required
          />
          <input 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className='login-signup__input'
            placeholder='Пароль' 
            type="password" 
            required
           />
          <button type='submit' className='login-signup__form-btn'>Зарегистрироваться</button>
        </form>
        <div className="login-signup__sign-in">
          <p className='login-signup__text'>Уже зарегистрированы?</p>
          <Link to='/login' className='login-signup__button'>Войти</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;