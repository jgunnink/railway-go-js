import React from 'react'
import Home from './containers/home'
import railway from './store/reducers'
import 'semantic-ui-css/semantic.min.css'

import { render } from 'react-dom';
import {
  createStore,
  combineReducers,
  compose,
  applyMiddleware
} from 'redux';

import { routerForBrowser } from 'redux-little-router';

import routes from './routes';
import wrap from './wrap';

const {
  reducer,
  middleware,
  enhancer  
} = routerForBrowser({ routes });

const store = createStore(
  combineReducers({ 
    router: reducer,
    railway: railway
  }),
  // If this is a server render, we grab the
  // initial state the hbs template inserted
 {},
  compose(
    enhancer,
    applyMiddleware(middleware),
    // window.devToolsExtension ?
    //   window.devToolsExtension() : f => f
  )
);

const Demo = ({ router }) => {
  return(
    <div/>
  )
}
render(
  wrap(store),
  document.getElementById('root')
);