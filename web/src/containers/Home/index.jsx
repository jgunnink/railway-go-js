import React from 'react'
import Welcome from '../../components/Welcome'
import { connect } from 'react-redux'
import changeActiveScreen from '../../store/actions/ui'

const Home = (props) => {
  return(
    <Welcome
      changeActiveScreen={props.changeActiveScreen}
      isAuthenticated={props.isAuthenticated}
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

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home)
export default HomeContainer
