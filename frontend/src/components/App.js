import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import api from "../utils/Api";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import EditProfilePopup from "./EditProfilePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Switch, useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import auth from "../utils/Auth";

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [infoTooltipState, setInfoTooltipState] = useState({
    isOpen: false,
    isError: false
  });
  const [selectedCard, setSelectedCard] = useState({isOpened: false});
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [email, setEmail] = useState('');
  const [jwt, setJwt] = useState('');
  const history = useHistory();

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setInfoTooltipState({...infoTooltipState, isOpen: false})
    setSelectedCard({isOpened: false})
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleCardClick = (data) => {
    setSelectedCard({isOpened: true, ...data})
  }

  function handleError(err) {
    console.log(err);
    closeAllPopups();
    setInfoTooltipState({
      isOpen: true,
      isError: true
    });
  }

  function handleUpdateUser({name, about}) {
    api.setUserInfo({name, about, jwt})
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          return Promise.reject(res);
        }
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch( err => {
        handleError(err);
      })
  }

  function handleUpdateAvatar({avatar}) {
    api.changeAvatar(avatar, jwt)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          return Promise.reject(res);
        }
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch( err => {
        handleError(err);
      })
  }

  function handleAddPlaceSubmit({name, link}) {
    api.addNewCard({name, link, jwt})
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          return Promise.reject(res);
        }
        setCards([res.data, ...cards]);
        closeAllPopups()
      })
      .catch( err => {
        handleError(err);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like === currentUser._id);
    api.changeLikeCardStatus(card.cardId, isLiked, jwt).then(res => res.json()).then((newCard) => {
      setCards((cards) => cards.map((c) => c._id === card.cardId ? newCard.data : c));
    })
    .catch( err => console.log(err))
  }

  function handleCardDelete(cardId) {
    api.deleteCard(cardId, jwt).then(res => res.json()).then( () => {
      setCards( cards => cards.filter( c => c._id !== cardId))
    })
    .catch( err => console.log(err))
  }

  function goToMainPage() {
    history.push('/');
  }

  function goToSignInPage() {
    history.push('/sign-in');
  }

  function goToLogInPage() {
    history.push('/login');
  }

  const onSignOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    goToSignInPage();
    setJwt('');
  }

  const authorization = (password, email) => {
    auth.authorization(password, email)
      .then(data => {
        localStorage.setItem('jwt', data.token);
        setJwt(data.token);
        setLoggedIn(true);
        goToMainPage();
      })
      .catch(err => {
        setInfoTooltipState({
          isOpen: true,
          isError: true
        });
        console.log(err);
      })
  }

  const registration = (password, email) => {
    auth.registration(password, email)
      .then(() => {
        setInfoTooltipState({
          isOpen: true,
          isError: false
        });
        goToLogInPage();
      })
      .catch((err) => {
        setInfoTooltipState({
          isOpen: true,
          isError: true
        });
        console.log(err);
      })
  }

  useEffect( () => {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt');
      setJwt(jwt);

      api.getUserInfo(jwt)
        .then((res) => {
          setCurrentUser(res.data)
          setLoggedIn(true);
          setEmail(res.data.email);
          goToMainPage();
        })
        .catch( err => console.log(err))
    }

    if (loggedIn && !cards.length) {
      const jwt = localStorage.getItem('jwt');
      api.getInitialCards(jwt)
        .then( data => setCards(data.data))
        .catch( err => console.log(err))
    }
  }, [loggedIn])

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          email={email}
          onSignOut={onSignOut}
        />

        <Switch>

          <Route path='/login'>
            <Login
              authorization={authorization}
            />
          </Route>

          <Route path='/sign-in'>
            <Register
              registration={registration}
            />
          </Route>

          <ProtectedRoute
            loggedIn={loggedIn}
            component={Main}
            onEditProfile = {handleEditProfileClick}
            onAddPlace = {handleAddPlaceClick}
            onEditAvatar = {handleEditAvatarClick}
            closeAllPopups = {closeAllPopups}
            selectedImgCard = {selectedCard}
            cards = {cards}
            onCardClick = {handleCardClick}
            onCardLike = {handleCardLike}
            onCardDelete = {handleCardDelete}
          />

        </Switch>

        {
          loggedIn && <Footer/>
        }
        
        <InfoTooltip
          state={infoTooltipState}
          onClose={closeAllPopups} 
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen} 
          onClose={closeAllPopups} 
          onUpdateUser={handleUpdateUser}
        />
        
        <EditAvatarPopup 
          isOpen={isEditAvatarPopupOpen} 
          onClose={closeAllPopups} 
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen} 
          onClose={closeAllPopups} 
          onAddPlace={handleAddPlaceSubmit}
        />

      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
