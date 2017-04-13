import request from "../../util/agent"
import { push } from "redux-little-router"
import changeActiveScreen from "./ui"
export const UPDATE_FAILURE = "UPDATE_FAILURE"
export const UPDATE_SUCCESS = "UPDATE_SUCCESS"

export function accountUpdate(dispatch, values) {
	return new Promise((resolve, reject) => {
    	request.post("/myaccount", values)
		.then((res) => {
			dispatch(receiveUpdate(res))
			dispatch(push("/myaccount"))
			dispatch(changeActiveScreen("account"))
		}).catch((err) => {
      		reject(err)
			dispatch(updateError(err))
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