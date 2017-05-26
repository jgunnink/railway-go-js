import immutable from "immutable"
import { RECEIVE_USERS } from "../actions/users"

function users(
	state = immutable.fromJS({
		list: []
	}), action)
{
	switch (action.type) {
	case RECEIVE_USERS:
		return state.merge(action)
	default:
		return state
	}
}

export default users
