const UPDATE_LOGIN = 'UPDATE_LOGIN'
const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
const LOGIN = 'LOGIN'


const initialState = {
  email: '',
  password: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOGIN: {
      return { ...state, email: action.email }
    }
    case UPDATE_PASSWORD: {
      return { ...state, password: action.password }
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
      .then((responce) => responce.json())
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token })
      })
  }
}
