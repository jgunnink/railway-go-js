import request from "../../util/agent"
import { receiveLogin } from "../actions/authentication"
import { receiveUsers } from "../actions/users"
import { push } from "redux-little-router"

const loadState = (dispatch, cb) => {
	request.get("/check_login").then((res) => {
		dispatch(receiveLogin(res.data))
		cb()
	}).catch(() => {
		dispatch(push("/"))
		cb()
	})
}

export const loadUsers = (dispatch) => {
	request.get("/admin/users").then((res) => {
		dispatch(receiveUsers(res.data))
	}).catch((err) => {
		console.log(err)
	})
}

export default loadState
