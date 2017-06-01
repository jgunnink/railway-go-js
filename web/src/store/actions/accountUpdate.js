import request from "../../util/agent"
import { push } from "redux-little-router"
import { addNotification } from "./notifications"
import changeActiveScreen from "./ui"
import loadState from "../loaders"
export const UPDATE_FAILURE = "UPDATE_FAILURE"
export const UPDATE_SUCCESS = "UPDATE_SUCCESS"

export function accountUpdate(dispatch, values) {
	return new Promise((resolve, reject) => {
		request.post("/myaccount", values)
			.then((res) => {
				dispatch(receiveUpdate(res))
				dispatch(push("/dashboard"))
				dispatch(changeActiveScreen("dashboard"))
				dispatch(addNotification("Successfully updated your account.", "success"))
				loadState(dispatch, () => { })
			}).catch((err) => {
				reject(err)
				dispatch(updateError(err))
				dispatch(addNotification("Couldn't update your account. Please try again later.", "error"))
			})
	})
}

function updateError(err) {
	return {
		type: UPDATE_FAILURE,
		success: false,
		status: err.response.status
	}
}

export function receiveUpdate(userdata) {
	return {
		type: UPDATE_SUCCESS,
		user: userdata
	}
}
