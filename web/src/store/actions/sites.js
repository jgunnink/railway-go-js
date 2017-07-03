import { get, post } from "railway/utils/agent"
import history from "railway/history"

export const SITES_SENDINGREQUEST = "SITES:SENDINGREQUEST"
export const SITES_LOAD = "SITES:LOAD"
export const SITES_SET_SITE = "SITES:SET:SITE"
export const SITES_UNSET_SITE = "SITES:UNSET:SITE"


export const loadSites = (sites) => {
	return { type: SITES_LOAD, sites }
}

export const sendingRequest = (sending) => {
	return { type: SITES_SENDINGREQUEST, sending }
}

export function fetchSites() {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		get("/sites/all")
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(loadSites(res.data))
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export const setSite = (site) => {
	return { type: SITES_SET_SITE, site }
}

export const unsetSite = (site) => {
	return { type: SITES_UNSET_SITE, site }
}

export function createSite(site) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/sites/create`, site)
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(setSite(res.data))
				history.push("/admin/sites/all")
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export function updateSite(site) {
	return (dispatch, getState) => {
		console.log(site.toJS())
		dispatch(sendingRequest(true))
		post(`/sites/${site.get("id")}/update`, site.toJS())
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(setSite(res.data))
				history.push("/admin/sites/all")
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}

export function archiveSite(site) {
	return (dispatch, getState) => {
		dispatch(sendingRequest(true))
		post(`/sites/${site.get("id")}/archive`)
			.then((res) => {
				dispatch(sendingRequest(false))
				dispatch(unsetSite(res.data))
			}).catch((err) => {
				console.log(err)
				dispatch(sendingRequest(false))
			})
	}
}
