import React from 'react'
import SignupForm from '../../components/SignupForm'
import { connect } from 'react-redux'
import { signup } from '../../store/actions/signup'

const SignupPage = (props) => {
  return(
    <SignupForm signup={props.signup} />
  )
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (values) => {dispatch(signup(values))}
  }
}

const SignupFormContainer = connect(mapStateToProps, mapDispatchToProps)(SignupPage)
export default SignupFormContainer
