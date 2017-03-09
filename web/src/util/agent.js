import axios from 'axios'

const request = axios.create({
  baseURL: '/',
  timeout: 1000,
  responseType: 'json',
  headers: {
  	"X-API": "v1",
  	"Content-Type":"application/json",
  	"X-Requested-With": "XMLHttpRequest"
  }
});

export default request