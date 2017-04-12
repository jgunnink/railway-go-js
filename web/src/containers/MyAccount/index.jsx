import React from "react"
import AccountDetailsForm from "../../components/MyAccount"
import { connect } from "react-redux"
import { accountUpdate } from "../../store/actions/accountUpdate"

const UserAccount = (props) => {
	const user = props.user
	return(
		<AccountDetailsForm
			accountUpdate={props.accountUpdate}
			errorCode={props.errorCode} 
			initialValues={{
				email: user.get("email"),
				first: user.get("firstName"),
				last: user.get("lastName")
			}}
		/>
	)
}

const mapStateToProps = (state, ownProps) => {
	const errorCode = state.railway.accountUpdate.get("status")
	const user = state.railway.authentication.get("user")
	return {
		errorCode,
		user: user
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
	  accountUpdate: accountUpdate
  }
}

const UserAccountContainer = connect(mapStateToProps, mapDispatchToProps)(UserAccount)
export default UserAccountContainer
