import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Button } from 'semantic-ui-react'
import SignupForm from './components/signupForm'
import 'semantic-ui-css/semantic.min.css'

import {
  BrowserRouter as Router,
  Link,
  Route
} from 'react-router-dom'

const Routes = () => (
  <Router history={history} forceRefresh={true}>
    <div>
      <Link to='/'>Home</Link>
      <Link to='/signup'>Signup</Link>

      <Route exact path="/" component={App}/>
      <Route path="/signup" component={SignupForm}/>
    </div>
  </Router>
)

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);
