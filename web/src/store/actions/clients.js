import { get, post } from "railway/utils/agent"
import history from "railway/history"
import { notification } from "antd"
export const CLIENTS_SENDINGREQUEST = "CLIENTS:SENDINGREQUEST"
export const CLIENTS_LOAD = "CLIENTS:LOAD"
export const CLIENTS_SET_CLIENT = "CLIENTS:SET:CLIENT"
export const CLIENTS_UNSET_CLIENT = "CLIENTS:UNSET:CLIENT"

export const loadClients = (clients) => {
	return { type: CLIENTS_LOAD, clients }
}

export const sendingRequest = (sending) => {
	return { type: CLIENTS_SENDINGREQUEST, sending }
}

export function fetchClients() {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		get("/clients/all")
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(loadClients(res.data))
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export const setClient = (client) => {
	return { type: CLIENTS_SET_CLIENT, client }
}

export const unsetClient = (client) => {
	return { type: CLIENTS_UNSET_CLIENT, client }
}

export function createClient(client) {
	return (dispatch, getState) => {
		notification["success"]({
			message: "Successfully created client",
		});
		dispatch(sendingRequest(true))
		post(`/clients/create`, client)
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(setClient(res.data))
				history.push("/admin/clients/all")
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export function updateClient(client) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/clients/${client.get("id")}/update`, client.toJS())
			.then((res) => {
				notification["success"]({
					message: "Successfully updated client",
				});
				dispatch(sendingRequest(false))
				dispatch(setClient(res.data))
				history.push("/admin/clients/all")
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export function archiveClient(client) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/clients/${client.get("id")}/archive`)
			.then((res) => {
				notification["success"]({
					message: "Successfully archived client",
				});
				dispatch(sendingRequest(false))
				dispatch(unsetClient(res.data))
			}).catch((err) => {
				console.log(err.response)
				notification["error"]({
					message: "Could not archive client",
					description: err.response.data.error_message,
				});
				dispatch(sendingRequest(false))
			})
	}
}
