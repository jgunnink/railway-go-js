import React from 'react'
import Navbar from '../../components/Navbar'
import { connect } from 'react-redux'
import changeActiveScreen from '../../store/actions/ui'
import { logout } from '../../store/actions/authentication'

const Home = (props) => {
  return(
    <Navbar 
			activeScreen={props.activeScreen}
			changeActiveScreen={props.changeActiveScreen}
      isAuthenticated={props.isAuthenticated}
      logout={props.logout}
		/>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
		activeScreen: state.railway.ui.get("activeScreen"),
    isAuthenticated: state.railway.authentication.get("isAuthenticated")
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))},
    logout: () => {dispatch(logout())}
  }
}

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home)
export default HomeContainer
