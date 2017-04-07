import request from "../../util/agent"
import { receiveLogin } from "../actions/authentication"
import { push } from "redux-little-router"

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