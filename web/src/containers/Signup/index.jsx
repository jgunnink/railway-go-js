import React from 'react'
import SignupForm from '../../components/SignupForm'
import { connect } from 'react-redux'
import { signup } from '../../store/actions/signup'

const SignupPage = (props) => {
  return(
    <SignupForm signup={props.signup} errorCode={props.errorCode} />
  )
}

const mapStateToProps = (state, ownProps) => {
  const errorCode = state.railway.signup.get("status")
  return {
    errorCode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: signup 
  }
}

const SignupFormContainer = connect(mapStateToProps, mapDispatchToProps)(SignupPage)
export default SignupFormContainer
