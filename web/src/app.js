import React, { PropTypes } from "react"
import { Fragment } from "redux-little-router"
import { connect } from "react-redux"
import Dashboard from "./containers/Dashboard"
import Home from "./containers/Home"
import Login from "./containers/Login"
import MyAccount from "./containers/MyAccount"
import Navbar from "./containers/Navbar"
import Registered from "./containers/Registered"
import Sidebar from "./containers/Sidebar"
import Signup from "./containers/Signup"
import UserManagement from "./containers/UserManagement"
import { changeActiveScreen } from "./store/actions/ui"
import "../assets/css/common.css"

const MemberArea = ({forRoute, children}) => (
	<Fragment forRoute={forRoute}>
		<div className="page-container">
			<Sidebar />
			<div className="page-content">
				{children}
			</div>
		</div>
	</Fragment>	
)

const AdminArea = ({forRoute, children}) => (
	<Fragment forRoute={forRoute}>
		<div className="page-container">
			<Sidebar />
			<div className="page-content">
				{children}
			</div>
		</div>
	</Fragment>	
)

const App = (props) => {
	const { router } = props
	let area = "landing"

	switch(router.pathname) {
		case "/":
		case "/login":
		case "/signup":
		case "/registered":
			area = "landing"
			break
		case "/admin":
			area = "admin"
			break
		default:
			area = "default"
			break
	}
  
	return (
		<div id="app" className={area}>
			<Navbar />
			{ router.pathname === "/" && <Home /> }
			<MemberArea forRoute="/dashboard"><Dashboard /></MemberArea>
			<MemberArea forRoute="/myaccount"><MyAccount /></MemberArea>
			<AdminArea forRoute="/admin/usermanagement"><UserManagement /></AdminArea>
			<Fragment forRoute="/login"><Login /></Fragment>
			<Fragment forRoute="/registered"><Registered /></Fragment>
			<Fragment forRoute="/signup"><Signup /></Fragment>
		</div>
	)
}

App.propTypes = {
	router: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
	return {
		activeScreen: state.railway.ui.get("activeScreen")
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))}
	}
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer
