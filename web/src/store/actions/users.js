import { get, post } from "railway/utils/agent"
import { notification } from "antd"
import { userFullName } from "railway/helpers/strings"
import history from "railway/history"

export const USERS_SENDINGREQUEST = "USERS:SENDINGREQUEST"
export const USERS_LOAD = "USERS:LOAD"
export const USERS_SET_USER = "USERS:SET:USER"
export const USERS_UNSET_USER = "USERS:UNSET:USER"

export const loadUsers = users => {
	return { type: USERS_LOAD, users }
}

export const setUser = user => {
	return { type: USERS_SET_USER, user }
}

export const unsetUser = user => {
	return { type: USERS_UNSET_USER, user }
}

export const sendingRequest = sending => {
	return { type: USERS_SENDINGREQUEST, sending }
}

export function fetchUsers() {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		get("/users/all")
			.then(res => {
				dispatch(sendingRequest(false))
				dispatch(loadUsers(res.data))
			})
			.catch(err => {
				dispatch(sendingRequest(false))
			})
	}
}

export function updateUser(user) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/users/${user.get("id")}/update`, user.toJS())
			.then(res => {
				dispatch(sendingRequest(false))
				dispatch(setUser(res.data))
				history.push("/management/users")
				notification["success"]({
					message: `Successfully updated ${userFullName(user)}`
				})
			})
			.catch(err => {
				console.log(err)
				dispatch(sendingRequest(false))
				notification["error"]({
					message: `${userFullName(user)} could not be updated.`,
					description: "Please check your permissions and the user account you are trying to change."
				})
			})
	}
}

export function disableUser(user) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/users/${user.get("id")}/disable`)
			.then(res => {
				dispatch(sendingRequest(false))
				dispatch(setUser(res.data))
				notification["success"]({
					message: `${userFullName(user)} has been disabled successfully.`
				})
			})
			.catch(err => {
				console.log(err)
				dispatch(sendingRequest(false))
				notification["warning"]({
					message: `${userFullName(user)} could not be disabled.`,
					description: "Have they been disabled already? Please check their account and try again."
				})
			})
	}
}

export function enableUser(user) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/users/${user.get("id")}/enable`)
			.then(res => {
				dispatch(sendingRequest(false))
				dispatch(setUser(res.data))
				notification["success"]({
					message: `${userFullName(user)} has been enabled successfully.`
				})
			})
			.catch(err => {
				console.log(err)
				dispatch(sendingRequest(false))
				notification["warning"]({
					message: `${userFullName(user)} could not be enabled.`,
					description: "Have they been enabled already? Please check their account and try again."
				})
			})
	}
}

export function archiveUser(user) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/users/${user.get("id")}/archive`)
			.then(res => {
				dispatch(sendingRequest(false))
				dispatch(unsetUser(res.data))
				notification["success"]({
					message: `${userFullName(user)} has been archived successfully.`
				})
			})
			.catch(err => {
				console.log(err)
				dispatch(sendingRequest(false))
				notification["error"]({
					message: `${userFullName(user)} could not be archived.`,
					description: "Please check their account and try again."
				})
			})
	}
}

export function sendPasswordReset(user) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/users/${user.get("id")}/passwordreset`)
			.then(res => {
				dispatch(sendingRequest(false))
				notification["success"]({
					message: `${userFullName(user)} has been sent a password
					reset email successfully.`,
					description: `Please get them to check their email in the
					next few minutes for instructions on how to set a new
					password.`
				})
			})
			.catch(err => {
				console.log(err)
				dispatch(sendingRequest(false))
				notification["warning"]({
					message: `Password reset email not sent.`,
					description: `It appears the message server is having
					problems sending email right now. Please try again later.`
				})
			})
	}
}
