import React from "react"
import Sidebar from "../../components/Dashboard/Sidebar"
import { connect } from "react-redux"
import changeActiveScreen from "../../store/actions/ui"
import { logout } from "../../store/actions/authentication"

const SideNavBar = (props) => {
	return(
    	<Sidebar
			activeScreen={props.activeScreen}
			changeActiveScreen={props.changeActiveScreen}
			logout={props.logout}
		/>
	)
}

const mapStateToProps = (state, ownProps) => {
	return {
		activeScreen: state.railway.ui.get("activeScreen")
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
