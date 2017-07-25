import React from "react"
import Register from "railway/components/Forms/Register"
import { userRegistration } from "railway/store/actions/registration"
import { connect } from "react-redux"

const RegisterContainer = ({ userRegistration }) => {
	return <Register userRegistration={userRegistration} />
}

const mapStateToProps = (state, ownProps) => {
	return {}
}

const mapDispatchToProps = dispatch => {
	return {
		userRegistration: formValues => {
			dispatch(userRegistration(formValues))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer)
