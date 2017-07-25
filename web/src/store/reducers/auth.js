import { AUTH_SENDINGREQUEST, AUTH_SET_USER, AUTH_FAIL, LOGGED_OUT } from "railway/store/actions/auth"
import Immutable from "immutable"

export const guestUser = Immutable.Map({
	email: "",
	name: "",
	role: ""
})

let initialState = Immutable.Map({
	loggedIn: false,
	sendingRequest: false,
	user: guestUser
})

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case AUTH_SENDINGREQUEST:
			return state.set("sendingRequest", action.sending)
		case AUTH_FAIL:
			return initialState
		case AUTH_SET_USER:
			return state.set("user", Immutable.fromJS(action.user)).set("loggedIn", true)
		case LOGGED_OUT:
			return initialState
		default:
			return state
	}
}

export default authReducer
