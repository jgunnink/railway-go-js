import axios from "axios"
import store from "railway/store"
import history from "railway/history"
import { notification } from "antd"
import { authFail } from "railway/store/actions/auth"

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

export const get = url => {
	return new Promise(function(resolve, reject) {
		request
			.get(url)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				if (err.response.status === 403) {
					store.dispatch(authFail())
					notification["warning"]({
						message: "You're not allowed to do that",
						description: `It looks like you don't have the required 
						permissions to complete that action. If you believe this
						 is a mistake, please contact your administrator.`,
						duration: 10
					})
					history.push("/")
				}
				reject(err)
			})
	})
}

export const post = (url, data) => {
	return new Promise(function(resolve, reject) {
		request
			.post(url, data)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export const del = (url, data) => {
	return new Promise(function(resolve, reject) {
		request
			.delete(url)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default request
