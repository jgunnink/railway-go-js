import immutable from "immutable"
import { LOGGED_OUT } from "railway/store/actions/auth"

import {
	USERS_SENDINGREQUEST,
	USERS_LOAD,
	USERS_SET_USER,
	USERS_UNSET_USER
} from "../actions/users"

let initialState = immutable.Map({
	loaded: false,
	users: {},
	sendingRequest: false
})

const usersReducer = (state = initialState, action) => {
	switch (action.type) {
		case USERS_SENDINGREQUEST:
			return state.set("sendingRequest", action.sending)
		case USERS_LOAD:
			return state.set("loaded", true).set("users", immutable.fromJS(action.users))
		case USERS_SET_USER:
			return state.setIn(
				["users", action.user.id.toString()],
				immutable.fromJS(action.user)
			)
		case USERS_UNSET_USER:
			return state.deleteIn(["users", action.user.id.toString()])
		case LOGGED_OUT:
			return initialState
		default:
			return state
	}
}

export default usersReducer
