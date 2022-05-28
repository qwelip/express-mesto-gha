import React, { useState } from 'react';

const Login = ({authorization}) => {

  const [email, setEmail] = useState('');
  const [password, SetPassword] = useState('');

  const clearInputs = () => {
    setEmail('');
    SetPassword('');
  }

  function onLogin(e) {
    e.preventDefault();
    authorization(password, email);
    clearInputs();
  }

  return (
    <section className='login-signup'>
      <div className="login-signup__wrapper">
        <h1 className='login-signup__title'>Вход</h1>
        <form onSubmit={onLogin} action="#">
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
            onChange={(e) => SetPassword(e.target.value)} 
            className='login-signup__input' 
            placeholder='Пароль' 
            type="password" 
            required
          />
          <button type='submit' className='login-signup__form-btn'>Войти</button>
        </form>
      </div>
    </section>
  );
};

export default Login;