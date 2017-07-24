import { post } from "railway/utils/agent"
import history from "railway/history"
import { notification } from "antd"

export const SIGNUP_FAILURE = "SIGNUP_FAILURE"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
export const USERS_SENDINGREQUEST = "USERS:SENDINGREQUEST"

export const sendingRequest = sending => {
	return { type: USERS_SENDINGREQUEST, sending }
}

export function userRegistration(formValues) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		formValues.client_id = 0
		formValues.role = "guest"
		formValues.data = {}
		post("/users/registration", formValues)
			.then(res => {
				dispatch(sendingRequest(false))
				history.push("/")
				notification["success"]({
					message: `Successfully signed up.`,
					description: `You can now sign in with the details you just used to create an account.`
					// TODO: Add this mail sender to the backend.
					// description: `An email has been sent to ${user.toJS().firstName}
					// with instructions welcoming them to the system.`
				})
			})
			.catch(err => {
				console.log(err)
				dispatch(sendingRequest(false))
				notification["error"]({
					message: "Couldn't sign you up.",
					description: "Please check the form details and try again."
				})
			})
	}
}
