import request from "../../util/agent"
import { push } from "redux-little-router"
import changeActiveScreen from "./ui"

export const SIGNUP_FAILURE = "SIGNUP_FAILURE"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"

export function signup(values) {
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

function signupError(err) {
  return {
    type: SIGNUP_FAILURE,
    success: false,
    status: err.response.status
  }
}

export function receiveSignup(userdata) {
  return {
    type: SIGNUP_SUCCESS,
    user: userdata
  }
}
