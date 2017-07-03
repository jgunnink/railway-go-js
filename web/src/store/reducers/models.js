import immutable from "immutable"
import { LOGGED_OUT } from "railway/store/actions/auth"

import {
	MODELS_SENDINGREQUEST,
	MODELS_LOAD,
	MODELS_SET_SITE,
	MODELS_UNSET_SITE,
} from "../actions/models"

let initialState = immutable.fromJS({
	loaded: false,
	models: {},
	sendingRequest: false
})

const sitesReducer = (state = initialState, action) => {
	switch (action.type) {
		case MODELS_SENDINGREQUEST:
			return state.set("sendingRequest", action.sending)
		case MODELS_LOAD:
			return state.set("loaded", true).set("models", immutable.fromJS(action.models))
		case MODELS_SET_SITE:
			return state.setIn(["models", action.model.id.toString()], immutable.fromJS(action.model))
		case MODELS_UNSET_SITE:
			return state.deleteIn(["models", action.model.id.toString()])
		case LOGGED_OUT:
			return initialState
		default:
			return state
	}
}

export default sitesReducer
