import axios from "axios"
import { push } from "redux-little-router"
import { addNotification } from "../store/actions/notifications"
import { unauthorised } from "../store/actions/authentication"

const request = axios.create({
	baseURL: "/",
	timeout: 1000,
	responseType: "json",
	headers: {
		"X-API": "v1",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest"
	}
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
	return response
}, function (error) {
	console.log(error.response)
	if ((error.response.status === 401) && (error.response.data.error_code !== 4011)) {
		window.store.dispatch(unauthorised())
		window.store.dispatch(push("/login"))
		window.store.dispatch(addNotification("It looks like you've logged in somewhere else. Please log in again to continue.", "error"))
	}
	else if (error.response.status === 403) {
		window.store.dispatch(push("/dashboard"))
		window.store.dispatch(addNotification("Sorry, you're not allowed to do that.", "error"))
	}
	return Promise.reject(error)
})

export default request
