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
  <Router history={history}>
    <div>
      <Link to='/'><Button content='Home' /></Link>
      <Link to='/signup'><Button content='Signup' color='orange'/></Link>

      <Route exact path="/" component={App}/>
      <Route path="/signup" component={SignupForm}/>
    </div>
  </Router>
)

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);
