import React from 'react'
import ReactDOM from 'react-dom'
import NavigationBar from './components/navBar'
import SignupForm from './components/signupForm'
import App from './App'
import 'semantic-ui-css/semantic.min.css'

import { 
  BrowserRouter as Router,
  Route 
} from 'react-router-dom'

const Routes = () => (
  <Router history={history}>
    <div>
      <NavigationBar/>
      <Route exact path="/" component={App}/>
      <Route path="/signup" component={SignupForm}/>
    </div>
  </Router>
)

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);
