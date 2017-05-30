import axios from 'axios'
import { push } from "redux-little-router"

const request = axios.create({
  baseURL: '/',
  timeout: 1000,
  responseType: 'json',
  headers: {
  	"X-API": "v1",
  	"Content-Type":"application/json",
  	"X-Requested-With": "XMLHttpRequest"
  }
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error.response.status === 403) {
		window.store.dispatch(push("/"))
	}
	return Promise.reject(error)
})

export default request
