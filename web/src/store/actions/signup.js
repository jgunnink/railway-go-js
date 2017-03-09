import request from '../../util/agent'
import { push } from 'redux-little-router'

export const SIGNUP_FAILURE = 'SIGNUP_FAILURE'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'

export function signup(formdetails) {
  return dispatch => {
    setTimeout(() => {
      request.post('/api/register', formdetails)
      .then((res) => {
        dispatch(push('/'))
      }).catch((err) => {
        dispatch(signupError(err))
      });
    }, 3000)
  }
}

function signupError(message) {
  return {
    type: SIGNUP_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

export function receiveSignup(userdata) {
  return {
    type: SIGNUP_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
    user: userdata
  }
}