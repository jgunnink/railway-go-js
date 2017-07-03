import { SCREEN_RESIZE, SCREEN_ACTIVATE } from 'railway/store/actions/ui'
import { LOGGED_OUT } from "railway/store/actions/auth"

import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	screenWidth: typeof window === 'object' ? window.innerWidth : null,
	screenHeight: typeof window === 'object' ? window.innerHeight : null,
	activeScreen: 'home',
})

const uiReducer = (state = initialState, action) => {
	switch (action.type) {
		case SCREEN_RESIZE:
		case SCREEN_ACTIVATE:
			return state.merge(action)
		case LOGGED_OUT:
			return initialState
		default:
			return state
	}
}

export default uiReducer
