import immutable from "immutable"
import { LOGGED_OUT } from "railway/store/actions/auth"

import {
	SITES_SENDINGREQUEST,
	SITES_LOAD,
	SITES_SET_SITE,
	SITES_UNSET_SITE,
} from "../actions/sites"

let initialState = immutable.fromJS({
	loaded: false,
	sites: {},
	sendingRequest: false
})

const sitesReducer = (state = initialState, action) => {
	switch (action.type) {
		case SITES_SENDINGREQUEST:
			return state.set("sendingRequest", action.sending)
		case SITES_LOAD:
			return state.set("loaded", true).set("sites", immutable.fromJS(action.sites))
		case SITES_SET_SITE:
			return state.setIn(["sites", action.site.id.toString()], immutable.fromJS(action.site))
		case SITES_UNSET_SITE:
			return state.deleteIn(["sites", action.site.id.toString()])
		case LOGGED_OUT:
			return initialState
		default:
			return state
	}
}

export default sitesReducer

