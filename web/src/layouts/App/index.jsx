import React from "react"
import { connect } from "react-redux"
import { Layout } from "antd"
import ClientsContainer from "railway/containers/Clients/All"
import ManagementDashboard from "railway/containers/Management/Dashboard"
import ClientUpdateForm from "railway/containers/Clients/Form/Update"
import ClientCreateForm from "railway/containers/Clients/Form/Create"
import UserEditForm from "railway/containers/Users/Update"
import LoginForm from "railway/containers/Forms/LoginForm"
import PasswordResetForm from "railway/containers/Forms/PasswordReset"
import Register from "railway/containers/Forms/Register"
import HorizontalMenuContainer from "railway/containers/Menus/Horizontal"
import { Route } from "react-router-dom"
import { checkAuthentication } from "railway/store/actions/auth"
import Home from "railway/components/Home"

const AppLayout = props => {
	const { user, loggedIn } = props

	// Render the password reset form if url is accessed.
	// If route doesn't start with prefix, then render the rest of the app.
	if (props.location.pathname.startsWith("/users/passwordreset/")) {
		return <Route path="/users/passwordreset/:uuid" component={PasswordResetForm} />
	}
	if (!loggedIn) {
		return (
			<Layout style={{ padding: 70, height: "100vh" }}>
				<Route path="/" component={LoginForm} />
				<Route path="/register" component={Register} />
			</Layout>
		)
	}
	const userRole = user.get("role")
	if (userRole === "admin" || userRole === "manager") {
		return (
			<Layout style={{ height: "100vh" }}>
				<HorizontalMenuContainer />
				<Layout>
					<Route exact path="/" component={Home} />
					<Route exact path="/clients/all" component={ClientsContainer} />
					<Route exact path="/clients/:id/update/" component={ClientUpdateForm} />
					<Route exact path="/clients/create" component={ClientCreateForm} />
					<Route exact path="/management" component={ManagementDashboard} />
					<Route path="/management/:tab" component={ManagementDashboard} />
					<Route path="/management/users/:id/update/" component={UserEditForm} />
				</Layout>
			</Layout>
		)
	}
	if (userRole === "staff") {
		return (
			<Layout style={{ height: "100vh" }}>
				<HorizontalMenuContainer />
				<Layout>
					<Route path="/" component={Home} />
				</Layout>
			</Layout>
		)
	}

	if (userRole === "client") {
		return (
			<Layout style={{ height: "100vh" }}>
				<HorizontalMenuContainer />
				<Layout>
					<Route path="/" component={Home} />
				</Layout>
			</Layout>
		)
	}
	if (userRole === "guest") {
		return (
			<Layout style={{ height: "100vh" }}>
				<HorizontalMenuContainer />
				<Layout>
					<div style={{ padding: "30px" }}>
						<h1>Welcome, and thanks for signing up!</h1>
						<p>Right now your account isn't assigned to any clients so there's nothing much for you to do.</p>
						<p>If you think this is a mistake, please contact your manager or administrator!</p>
						<p>Have a lovely day!</p>
					</div>
				</Layout>
			</Layout>
		)
	}
	return <div />
}

function mapStateToProps(state, ownProps) {
	return {
		sendingRequest: state.get("auth").get("sendingRequest"),
		checkingAuthentication: state.get("auth").get("checkingAuthentication"),
		loggedIn: state.get("auth").get("loggedIn"),
		user: state.get("auth").get("user")
	}
}

function mapDispatchToProps(dispatch) {
	return {
		checkAuthentication: () => {
			dispatch(checkAuthentication())
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout)
