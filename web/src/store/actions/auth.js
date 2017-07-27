import { get, post } from "railway/utils/agent"
import { notification } from "antd"
import history from "railway/history"

export const AUTH_FAIL = "AUTH:FAIL"
export const AUTH_SENDINGREQUEST = "AUTH:SENDINGREQUEST"
export const AUTH_SET_USER = "AUTH:SET:USER"
export const CHECKING_AUTHENTICATION = "AUTH:CHECKINGAUTHENTICATION"
export const LOGGED_OUT = "AUTH:LOGGEDOUT"

export const loadViewPort = page => {
	return {
		page,
		type: "LOAD:VIEWPORT"
	}
}

export const authFail = () => {
	return { type: AUTH_FAIL }
}

export const checkingAuthentication = () => {
	return { type: CHECKING_AUTHENTICATION }
}

function receiveLogout(message) {
	return {
		type: LOGGED_OUT,
		isFetching: false,
		isAuthenticated: false
	}
}

export const setUser = user => {
	return { type: AUTH_SET_USER, user }
}

export const sendingRequest = sending => {
	return { type: AUTH_SENDINGREQUEST, sending }
}

export const loginError = err => {
	return { type: AUTH_FAIL }
}

// From https://stackoverflow.com/questions/2144386/how-to-delete-a-cookie
const create_cookie = (name, value, days) => {
	var expires = ""
	if (days) {
		var date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = "; expires=" + date.toGMTString()
	}

	document.cookie = name + "=" + value + expires + "; path=/"
}

export function logout() {
	return (dispatch, getState) => {
		create_cookie("_railway_session", "", -10)
		dispatch(receiveLogout())
		notification["success"]({
			message: "You have successfully logged out.",
			duration: 3
		})
		dispatch(checkAuthentication())
	}
}

export function login(email, password) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post("/auth/sign_in", { email, password })
			.then(res => {
				dispatch(sendingRequest(false))
				dispatch(setUser(res.data))
				history.push("/")
			})
			.catch(err => {
				dispatch(sendingRequest(false))
				dispatch(loginError(err))
				notification["error"]({
					message: "Sorry, could not log you in.",
					description: `Please check your password and try again.	If
					your password is correct, there may be a problem with the
					server, or your account has been disabled.`,
					duration: 10
				})
			})
	}
}

export function checkAuthentication(cb) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		get("/auth/check")
			.then(res => {
				dispatch(checkingAuthentication())
				dispatch(sendingRequest(false))
				dispatch(setUser(res.data))
				cb()
			})
			.catch(err => {
				dispatch(sendingRequest(false))
				dispatch(loginError(err))
				if (typeof cb === "function") {
					cb()
				}
			})
	}
}

export function passwordReset(email, password, password_reset_token) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post("/users/passwordreset", { email, password, password_reset_token })
			.then(res => {
				dispatch(sendingRequest(false))
				history.push("/")
				notification["success"]({
					message: "Successfully reset password.",
					description: `You have successfully set a new password.
					You may now log into the system with your email address and
					new password.`
				})
			})
			.catch(err => {
				dispatch(sendingRequest(false))
				dispatch(loginError(err))
				notification["error"]({
					message: "Sorry, could not reset your password.",
					description: `The link you have used to reset your password
					may have expired, or the unique link does not match your
					email address. Please check the link and try again.`
				})
			})
	}
}
