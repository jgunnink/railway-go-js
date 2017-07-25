import immutable from "immutable"
import { LOGGED_OUT } from "railway/store/actions/auth"
import {
	CLIENTS_SENDINGREQUEST,
	CLIENTS_LOAD,
	CLIENTS_SET_CLIENT,
	CLIENTS_UNSET_CLIENT
} from "../actions/clients"

let initialState = immutable.fromJS({
	loaded: false,
	clients: {},
	sendingRequest: false
})

const clientsReducer = (state = initialState, action) => {
	switch (action.type) {
		case CLIENTS_SENDINGREQUEST:
			return state.set("sendingRequest", action.sending)
		case CLIENTS_LOAD:
			return state.set("loaded", true).set("clients", immutable.fromJS(action.clients))
		case CLIENTS_SET_CLIENT:
			return state.setIn(["clients", action.client.id.toString()], immutable.fromJS(action.client))
		case CLIENTS_UNSET_CLIENT:
			return state.deleteIn(["clients", action.client.id.toString()])
		case LOGGED_OUT:
			return initialState
		default:
			return state
	}
}

export default clientsReducer
