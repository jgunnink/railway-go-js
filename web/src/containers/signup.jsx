import { connect } from 'react-redux'
import { changeActiveScreen } from '../store/actions/ui'
import SignupForm from '../components/signupForm'
import NavigationBar from '../components/navBar'
import React from 'react'

const SignupPage = (props) => {
  return(
    <div>
      <NavigationBar 
        changeActiveScreen={props.changeActiveScreen}
        activeScreen={props.activeScreen}
      />
      <SignupForm />
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

const SignupFormContainer = connect(mapStateToProps, mapDispatchToProps)(SignupPage)
export default SignupFormContainer