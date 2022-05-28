class Auth {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  handleResponse(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Ошибка ${res.status}`)
  }

  registration(password, email) {
    return fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        password,
        email
      })
    })
    .then((res) => this.handleResponse(res))
  }

  authorization(password, email) {
    return fetch(`${this.baseUrl}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        password,
        email
      })
    })
    .then((res) => this.handleResponse(res))
  }

  getUserInfo(jwt) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${jwt}`
      }
    })
    .then((res) => this.handleResponse(res))
  }
}

// const auth = new Auth('https://auth.nomoreparties.co');
const auth = new Auth('http://localhost:3000');

export default auth