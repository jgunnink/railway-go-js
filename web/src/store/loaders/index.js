import request from "../../util/agent"
import { receiveLogin } from "../actions/authentication"
import { push } from "redux-little-router"

let loaded = {assets:false, pois: false}
const callback = (name, cb) => () => {
	loaded[name] = true
	for (let key of Object.keys(loaded)) {
		if (key === false) return
	}
	cb()
}

const loadState = (dispatch, cb) => {
	request.get("/check_login").then((res) => {
		dispatch(receiveLogin(res.data))
        cb()
	}).catch(() => {
		dispatch(push("/login"))
		cb()
	})
}

export default loadState