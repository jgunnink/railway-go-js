import React from "react"
import Immutable from 'immutable'
import UserFormModal from "railway/components/Users/Form"
import { connect } from "react-redux"
import { createUser } from "railway/store/actions/users"

const UsersFormContainer = (props) => {
	return <UserFormModal {...props} visible={true} />
}

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: Immutable.fromJS({
			name: "",
			email: "",
		})
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		// submit: (userID, user) => { dispatch(createUser(userID, user)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersFormContainer)
