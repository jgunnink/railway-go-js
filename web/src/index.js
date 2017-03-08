import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import SignupFormContainer from './containers/signup'
import Home from './containers/home'
import railway from './store/reducers'
import 'semantic-ui-css/semantic.min.css'

import { 
  BrowserRouter as Router,
  Route 
} from 'react-router-dom'

let store = createStore(railway)
window.store = store

const Routes = () => (
  <Router history={history}>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/signup" component={SignupFormContainer}/>
    </div>
  </Router>
)

ReactDOM.render(
  <Provider store={store}><Routes /></Provider>,
  document.getElementById('root')
);
