import React from 'react'
import Navbar from '../../components/Navbar'
import { connect } from 'react-redux'
import changeActiveScreen from '../../store/actions/ui'

const Home = (props) => {
  return(
    <Navbar 
			activeScreen={props.activeScreen}
			changeActiveScreen={props.changeActiveScreen}
      isAuthenticated={props.isAuthenticated}
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
    changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))}
  }
}

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home)
export default HomeContainer
