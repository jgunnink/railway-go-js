import ReactDOM from "react-dom"
import thunk from "redux-thunk"
import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { reducer as form } from "redux-form/immutable"

import { routerForBrowser } from "redux-little-router"

import routes from "./routes"
import wrap from "./wrap"
import App from "./app"
import loadState from "./store/loaders"
import fetch from "./store/middleware/fetch"

import railway from "./store/reducers"
import "semantic-ui-css/semantic.min.css"

const { reducer, enhancer, middleware } = routerForBrowser({ routes })
const store = createStore(
  combineReducers({ router: reducer, railway: railway, form: form }),
  window.__INITIAL_STATE || {},
  compose(
    enhancer,
    applyMiddleware(middleware, thunk, fetch),
    window.devToolsExtension ?
      window.devToolsExtension() : f => f
  )
)

window.store = store
const render = () => {
  ReactDOM.render(
    wrap(store)(App),
    document.getElementById("root")
  )
}

loadState(store.dispatch, () => {
	render()
})
