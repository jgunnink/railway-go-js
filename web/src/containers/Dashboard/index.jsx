import React from 'react'
import Dashboard from '../../components/Dashboard'
import { connect } from 'react-redux'
import changeActiveScreen from '../../store/actions/ui'

const Dash = (props) => {
  return(
    <Dashboard
      changeActiveScreen={props.changeActiveScreen}
    />
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: state.railway.authentication.get("isAuthenticated")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))}
  }
}

const DashContainer = connect(mapStateToProps, mapDispatchToProps)(Dash)
export default DashContainer