class Api{
  constructor({cardsUrl, updateUserInfoUrl, getUserInfoUrl, token}) {
    this._cardsUrl = cardsUrl;
    this._updateUserInfoUrl = updateUserInfoUrl;
    this._getUserInfoUrl = getUserInfoUrl;
    // this._token = token;
  }

  handleResponse(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Ошибка ${res.status}`)
  }

  getInitialCards(token) {
    return fetch(this._cardsUrl, {
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => this.handleResponse(res))
  }

  getUserInfo(token) {
    return fetch(this._getUserInfoUrl, {
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
    })
    .then((res) => this.handleResponse(res))
  }

  setUserInfo = ({name, about}) => {
    return fetch(`${this._updateUserInfoUrl}/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        about
      })
    })
  }

  addNewCard({name, link}) {
    return fetch(this._cardsUrl, {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        link
      })
    })
  }

  deleteCard = (cardId) => {
    return fetch(`${this._cardsUrl}/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
  }

  changeLikeCardStatus = (cardId, isLiked) => {
    const meth = isLiked ? 'DELETE' : 'PUT';
    return fetch(`${this._cardsUrl}/${cardId}/likes`, {
      method: meth,
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
  }

  changeAvatar = (url) => {
    return fetch(`${this._updateUserInfoUrl}/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: url
      })
    })
  }
}

const api = new Api ({
  // cardsUrl: 'https://mesto.nomoreparties.co/v1/cohort36/cards',
  cardsUrl: 'http://localhost:3000/cards',
  // updateUserInfoUrl: 'https://mesto.nomoreparties.co/v1/cohort36/users',
  updateUserInfoUrl: 'http://localhost:3000/users',
  // getUserInfoUrl: 'https://nomoreparties.co/v1/cohort36/users/me',
  getUserInfoUrl: 'http://localhost:3000/users/me',
  // token: 'edd7092a-48ca-4ae4-81a0-05e569754f8c'
  // token: ''
  }
)

export default api
