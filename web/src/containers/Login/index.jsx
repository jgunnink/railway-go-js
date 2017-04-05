import React from "react"
import LoginForm from "../../components/LoginForm"
import { connect } from "react-redux"
import { login } from "../../store/actions/authentication"

const LoginPage = (props) => {
  return(
    <div>
      <h1> Hello</h1>
      <LoginForm login={props.login} errorCode={props.errorCode} />
      </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const errorCode = state.railway.login.get("status")
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
