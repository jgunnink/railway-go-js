import { loadUsers } from "./../loaders"

const fetch = store => next => action => {
    if (action.type !== "ROUTER_LOCATION_CHANGED") {
        return next(action)
    }
	if (action.payload.route === "/admin/usermanagement") {
		loadUsers(store.dispatch)
	}
	return next(action)
}

export default fetch  
