import { connect } from 'react-redux'
import { changeActiveScreen } from '../store/actions/ui'
import Welcome from '../components/welcome'
import NavigationBar from '../components/navBar'
import React from 'react'

const Home = (props) => {
  return(
    <div>
      <NavigationBar 
        changeActiveScreen={props.changeActiveScreen}
        activeScreen={props.activeScreen}
      />
      <Welcome
        changeActiveScreen={props.changeActiveScreen}
      />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeScreen: state.ui.get('activeScreen')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))}
  }
}

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home)
export default HomeContainer