import request from '../../util/agent'
import loadState from '../loaders'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

import { push } from "redux-little-router"

window.push = push

export function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

export function receiveLogin(userdata) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    user: userdata
  }
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

function receiveLogout(message) {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}

export function checkAuth(end) {
  return dispatch => {
    dispatch(requestLogin({}))
    request.get('/authenticate')
      .accept('application/json')
      .then((res) => {
          dispatch(receiveLogin(res.data))
      }).catch((err) => {
          dispatch(loginError(res))
      })
  }
}

export function logout(creds) {
  return dispatch => {
    request.delete('/logout')
      .then((res) => {
        dispatch(receiveLogout())
        dispatch(push('/login'))
      })
  }
}

export function login(creds) {
  return dispatch => {
    dispatch(requestLogin(creds))
    request.post('/auth', creds)
      .then((res) => {
        loadState(dispatch, () => {
          dispatch(push('/'))
        })
      }).catch((err) => {
        dispatch(loginError(err))
    })
  }
}
