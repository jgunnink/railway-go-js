import request from "../../util/agent"
import { push } from "redux-little-router"
import changeActiveScreen from "./ui"
import { addNotification } from "./notifications"
export const SIGNUP_FAILURE = "SIGNUP_FAILURE"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"

export function signup(dispatch, values) {
  return new Promise((resolve, reject) => {
    request.post("/register", values)
    .then((res) => {
      dispatch(receiveSignup(res))
      dispatch(push("/registered"))
      dispatch(changeActiveScreen("home"))
	  dispatch(addNotification("Signup successful.", "success"))
    }).catch((err) => {
      reject(err)
      dispatch(signupError(err))
	  dispatch(addNotification("Couldn't sign you up. Please check your details.", "error"))
    })
  })
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
