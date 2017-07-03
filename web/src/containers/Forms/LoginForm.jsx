import React from "react"
import LoginForm from "railway/components/Forms/LoginForm"
import { login } from "railway/store/actions/auth"
import { connect } from "react-redux"

const LoginFormContainer = ({ login }) => {
	return <LoginForm login={login} />
}

const mapStateToProps = (state, ownProps) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		login: (email, password) => { dispatch(login(email, password)) },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormContainer)
