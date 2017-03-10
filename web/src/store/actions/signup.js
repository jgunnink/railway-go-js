import request from "../../util/agent"
import { push } from "redux-little-router"
import changeActiveScreen from "./ui"

export const SIGNUP_FAILURE = "SIGNUP_FAILURE"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"

export function signup(values) {
  console.log(values.toJS())
  return dispatch => {
    request.post("/register", values)
    .then((res) => {
      dispatch(push("/"))
      dispatch(changeActiveScreen("home"))
    }).catch((err) => {
      dispatch(signupError(err))
    })
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
