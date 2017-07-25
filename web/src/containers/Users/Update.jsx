import React from "react"
import UserFormModal from "railway/components/Users/Form"
import { connect } from "react-redux"
import { updateUser } from "railway/store/actions/users"

const UsersFormContainer = (props) => {
	return <UserFormModal {...props} visible={true} />
}

const mapStateToProps = (state, ownProps) => {
	const userID = ownProps.match.params.id
	const user = state.get("users").get("users").get(userID)
	return {
		initialValues: user,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		submit: (user) => { dispatch(updateUser(user)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersFormContainer)
