class Api{
  constructor({cardsUrl, updateUserInfoUrl, getUserInfoUrl, }) {
    this._cardsUrl = cardsUrl;
    this._updateUserInfoUrl = updateUserInfoUrl;
    this._getUserInfoUrl = getUserInfoUrl;
  }

  handleResponse(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(res)
  }

  getInitialCards(jwt) {
    return fetch(this._cardsUrl, {
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => this.handleResponse(res))
  }

  getUserInfo(jwt) {
    return fetch(this._getUserInfoUrl, {
    headers: {
      "Authorization" : `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    }
    })
    .then((res) => this.handleResponse(res))
  }

  setUserInfo = ({name, about, jwt}) => {
    return fetch(`${this._updateUserInfoUrl}/me`, {
      method: 'PATCH',
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        about
      })
    })
  }

  addNewCard({name, link, jwt}) {
    return fetch(this._cardsUrl, {
      method: 'POST',
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        link
      })
    })
  }

  deleteCard = (cardId, jwt) => {
    return fetch(`${this._cardsUrl}/${cardId}`, {
      method: 'DELETE',
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
  }

  changeLikeCardStatus = (cardId, isLiked, jwt) => {
    const method = isLiked ? 'DELETE' : 'PUT';
    return fetch(`${this._cardsUrl}/${cardId}/likes`, {
      method,
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
  }

  changeAvatar = (url, jwt) => {
    return fetch(`${this._updateUserInfoUrl}/me/avatar`, {
      method: 'PATCH',
      headers: {
        "Authorization" : `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: url
      })
    })
  }
}

const api = new Api ({
  cardsUrl: 'api.andmed-practicum.nomoredomains.xyz/cards',
  updateUserInfoUrl: 'api.andmed-practicum.nomoredomains.xyz/users',
  getUserInfoUrl: 'api.andmed-practicum.nomoredomains.xyz/users/me',
  }
)

export default api
