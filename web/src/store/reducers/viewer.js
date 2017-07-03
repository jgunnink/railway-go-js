import immutable from "immutable"
import {
	VIEWER_SET_MODEL
} from "railway/store/actions/viewer"

const initialState = immutable.fromJS({
	activeModel: {},
})

function viewer(state = initialState, action) {
	switch (action.type) {
		case VIEWER_SET_MODEL:
			return state.merge(action)
		default:
			return state
	}
}

export default viewer
