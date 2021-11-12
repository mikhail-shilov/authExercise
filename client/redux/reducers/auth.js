import Cookies from 'universal-cookie'
import { history } from '..'

const UPDATE_LOGIN = 'UPDATE_LOGIN'
const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
const LOGIN = 'LOGIN'

const cookies = new Cookies()

const initialState = {
  email: '',
  password: '',
  token: cookies.get('token'),
  user: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOGIN: {
      return { ...state, email: action.email }
    }
    case UPDATE_PASSWORD: {
      return { ...state, password: action.password }
    }
    case LOGIN: {
      return { ...state, token: action.token, password: '', user: action.user }
    }
    default:
      return state
  }
}

export const updateLoginField = (email) => ({ type: UPDATE_LOGIN, email })
export const updatePasswordField = (password) => ({ type: UPDATE_PASSWORD, password })

export function signIn() {
  return (dispatch, getState) => {
    const { email, password } = getState().auth
    fetch('/api/v1/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token, user: data.user })
        history.push('/private')
      })
  }
}

export function trySignIn() {
  return (dispatch) => {
    fetch('/api/v1/auth')
      .then((responce) => responce.json())
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token, user: data.user })
        history.push('/private')
      })
  }
}

export function tryUserInfo() {
  return () => {
    fetch('/api/v1/user-info')
      .then((response) => response.json())
      .then((data) => {
        console.log('User-info access:', data.status)
      })
  }
}
