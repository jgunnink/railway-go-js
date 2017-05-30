import Immutable from "immutable"
import { ADD_NOTIFICATION, CLEAR_NOTIFICATION } from "../actions/notifications"


export default function notifications(state = Immutable.Map(), action) {
	switch (action.type) {
		case ADD_NOTIFICATION:
			return state.set("message", action.message).set("level", action.level)
		case CLEAR_NOTIFICATION:
			return Immutable.Map()
		default:
			return state
	}
}
