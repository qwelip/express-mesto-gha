import React from 'react';
import logoImg from '../images/logo.svg';
import {Link, Switch, Route} from 'react-router-dom';

const Header = ({email, onSignOut}) => {

  return (
    <header className="header">
      <img src={logoImg} alt="Логотип Место" className="header__logo"/>

      <div className='header__title'>
        <Switch>
          <Route path='/login'>
              <Link 
                className='header__button' 
                to='/sign-in'
              >
                Регистрация
              </Link>
          </Route>
          <Route path='/sign-in'>
            <Link 
                className='header__button' 
                to='/login'
              >
                Войти
            </Link>
          </Route>
          <Route exact path='/'>
            <p className='header__email'>{email}</p>
            <button 
              className='header__button' 
              to='/login'
              onClick={onSignOut}
            >
              Выйти
            </button>
          </Route>
        </Switch>
      </div>
    </header>
  );
};

export default Header;