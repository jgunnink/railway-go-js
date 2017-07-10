import auth from "railway/store/reducers/auth"
import thunk from "redux-thunk"
import users from "railway/store/reducers/users"
import clients from "railway/store/reducers/clients"
import ui from "railway/store/reducers/ui"
import viewer from "railway/store/reducers/viewer"
import { screenResize } from 'railway/store/actions/ui'
import { createStore, applyMiddleware } from "redux"
import { combineReducers } from "redux-immutable"
import { Map } from "immutable"
import { reducer as forms } from "ninja-forms"

function configureStore(initialState = Map({})) {
	const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

	const store = createStoreWithMiddleware(combineReducers({
		auth,
		clients,
		forms,
		ui,
		users,
		viewer,
	}), initialState)

	window.addEventListener("resize", () => {
		store.dispatch(screenResize(window.innerWidth, window.innerHeight));
	})
	return store
}

const store = configureStore()
export default store
