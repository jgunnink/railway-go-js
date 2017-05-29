import React from 'react'
import UserManagement from '../../components/UserManagement'
import { connect } from 'react-redux'
import changeActiveScreen from '../../store/actions/ui'
import archiveUser from '../../store/actions/archiveUser'

const UserMgmt = (props) => {
	return(
		<UserManagement {...props} />
	)
}

const mapStateToProps = (state, ownProps) => {
	return {
		isAuthenticated: state.railway.authentication.get("isAuthenticated"),
		role: state.railway.authentication.get("user").get("role"),
		users: state.railway.users.get("list")
  	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))},
		archiveUser: (userID) => {dispatch(archiveUser(userID))}
	}
}

const UserMgmtContainer = connect(mapStateToProps, mapDispatchToProps)(UserMgmt)
export default UserMgmtContainer
