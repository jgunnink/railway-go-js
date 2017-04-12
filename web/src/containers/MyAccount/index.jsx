import React from "react"
import MyAccount from "../../components/MyAccount"
import { connect } from "react-redux"
import { accountUpdate } from "../../store/actions/accountUpdate"

const UserAccount = (props) => {
  return(
	  <MyAccount accountUpdate={props.accountUpdate} errorCode={props.errorCode} />
  )
}

const mapStateToProps = (state, ownProps) => {
	const errorCode = state.railway.accountUpdate.get("status")
	return {
		errorCode
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
	  accountUpdate: accountUpdate
  }
}

const UserAccountContainer = connect(mapStateToProps, mapDispatchToProps)(UserAccount)
export default UserAccountContainer
