import React from "react"
import LoginForm from "../../components/LoginForm"
import { connect } from "react-redux"
import { login } from "../../store/actions/authentication"

const LoginPage = (props) => {
  return(
      <LoginForm login={props.login} errorCode={props.errorCode} />
  )
}

const mapStateToProps = (state, ownProps) => {
  const errorCode = state.railway.authentication.get("status")
  return {
    errorCode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: login
  }
}

const LoginFormContainer = connect(mapStateToProps, mapDispatchToProps)(LoginPage)
export default LoginFormContainer
