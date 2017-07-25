import React from "react"
import ReactDOM from "react-dom"
import registerServiceWorker from "./registerServiceWorker"
import "railway/assets/css/index.css"
import "railway/assets/css/app.css"
import AppLayout from "railway/layouts/App"
import { Provider } from "react-redux"
import { Router, Route } from "react-router-dom"
import history from "railway/history"
import store from "railway/store"
import { LocaleProvider } from "antd"
import enUS from "antd/lib/locale-provider/en_US"
import { checkAuthentication } from "railway/store/actions/auth"

window.store = store

const App = () =>
	<Provider store={store}>
		<Router history={history}>
			<div>
				<Route path="/" component={AppLayout} />
			</div>
		</Router>
	</Provider>

store.dispatch(
	checkAuthentication(() => {
		try {
			let loading = document.getElementById("loading")
			loading.parentNode.removeChild(loading)
		} catch (err) {
			console.log(err)
		}
		ReactDOM.render(
			<LocaleProvider locale={enUS}>
				<App />
			</LocaleProvider>,
			document.getElementById("root")
		)
	})
)
registerServiceWorker()
