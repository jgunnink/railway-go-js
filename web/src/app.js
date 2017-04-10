import React, { PropTypes } from "react"
import { Fragment } from "redux-little-router"
import { connect } from "react-redux"
import Home from "./containers/Home"
import Registered from "./containers/Registered"
import Signup from "./containers/Signup"
import Login from "./containers/Login"
import Navbar from "./containers/Navbar"
import Dashboard from "./containers/Dashboard"
import { changeActiveScreen } from "./store/actions/ui"

const App = (props) => {
  const { router } = props
  return (
    <div>
      <Navbar />
      { router.pathname === "/" && <Home /> }
      <div>
        <Fragment forRoute="/dashboard"><Dashboard /></Fragment>
      </div>
      <div>
        <Fragment forRoute="/login"><Login /></Fragment>
      </div>
      <div>
        <Fragment forRoute="/registered"><Registered /></Fragment>
      </div>
      <div>
        <Fragment forRoute="/signup"><Signup /></Fragment>
      </div>
    </div>
  )
}

App.propTypes = {
  router: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeScreen: state.railway.ui.get("activeScreen")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))}
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer
