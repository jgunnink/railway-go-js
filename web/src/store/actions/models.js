import { get, post } from "railway/utils/agent"
import history from "railway/history"

export const MODELS_SENDINGREQUEST = "MODELS:SENDINGREQUEST"
export const MODELS_LOAD = "MODELS:LOAD"
export const MODELS_SET_SITE = "MODELS:SET:MODEL"
export const MODELS_UNSET_SITE = "MODELS:UNSET:MODEL"


export const loadModels = (models) => {
	return { type: MODELS_LOAD, models }
}

export const sendingRequest = (sending) => {
	return { type: MODELS_SENDINGREQUEST, sending }
}

export function fetchModels() {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		get("/models/all")
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(loadModels(res.data))
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export const setModel = (model) => {
	return { type: MODELS_SET_SITE, model }
}

export const unsetModel = (model) => {
	return { type: MODELS_UNSET_SITE, model }
}

export function createModel(model) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/models/create`, model)
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(setModel(res.data))
				history.push("/")
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export function updateModel(model) {
	return (dispatch, getState) => {
		console.log(model.toJS())
		dispatch(sendingRequest(true))
		post(`/models/${model.get("id")}/update`, model.toJS())
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(setModel(res.data))
				history.push("/")
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export function archiveModel(model) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/models/${model.get("id")}/archive`)
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(unsetModel(res.data))
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}
