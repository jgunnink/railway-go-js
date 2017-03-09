import React from 'react'
import { Provider } from 'react-redux'
import { RouterProvider, Fragment } from 'redux-little-router'
import Home from './containers/home'
import Signup from './containers/signup'

console.log(Provider)
console.log(RouterProvider)
console.log(Fragment)
console.log(Home)
console.log(Signup)

export default store => props =>(
  <RouterProvider store={store}>
    <Fragment forRoute='/'>
      <div />
    </Fragment>
    <Fragment forRoute='/signup'>
      <div />
    </Fragment>
  </RouterProvider>
)