import Immutable from "immutable"
import { UPDATE_SUCCESS, UPDATE_FAILURE } from "../actions/accountUpdate"

const initialState = Immutable.fromJS({
	success: undefined,
	status: undefined
})

function update(state = initialState, action) {
	switch (action.type) {
		case UPDATE_FAILURE:
			return state.merge(action)
		case UPDATE_SUCCESS:
			return state.merge(action)
		default:
			return state
	}
}

export default update
