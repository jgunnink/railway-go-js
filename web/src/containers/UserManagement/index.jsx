import React from 'react'
import UserManagement from '../../components/UserManagement'
import { connect } from 'react-redux'
import changeActiveScreen from '../../store/actions/ui'

const UserMgmt = (props) => {
	return(
		<UserManagement
      		changeActiveScreen={props.changeActiveScreen}
			role={props.role}
		/>
	)
}

const mapStateToProps = (state, ownProps) => {
	return {
		isAuthenticated: state.railway.authentication.get("isAuthenticated"),
		role: state.railway.authentication.get("user").get("role")
  	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))}
	}
}

const UserMgmtContainer = connect(mapStateToProps, mapDispatchToProps)(UserMgmt)
export default UserMgmtContainer
