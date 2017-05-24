import React from "react"
import Sidebar from "../../components/Sidebar"
import { connect } from "react-redux"
import changeActiveScreen from "../../store/actions/ui"
import { logout } from "../../store/actions/authentication"

const SideNavBar = (props) => {
	return(
    	<Sidebar {...props} />
	)
}

const mapStateToProps = (state, ownProps) => {
	return {
		activeScreen: state.railway.ui.get("activeScreen"),
		role: state.railway.authentication.get("user").get("role")
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))},
		logout: () => {dispatch(logout())}
	}
}

const SidebarContainer = connect(mapStateToProps, mapDispatchToProps)(SideNavBar)
export default SidebarContainer
