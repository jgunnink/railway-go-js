import React from "react"
import { connect } from "react-redux"
import { Layout, Row, Col } from "antd"
import SiteSelectorContainer from "railway/containers/SiteSelector"
import ClientsContainer from "railway/containers/Clients/All"
import ClientDashboard from "railway/containers/Clients/Dashboard"
import ClientUpdateForm from "railway/containers/Clients/Form/Update"
import ClientCreateForm from "railway/containers/Clients/Form/Create"
import SitesContainer from "railway/containers/Sites/All"
import SiteUpdateForm from "railway/containers/Sites/Form/Update"
import SiteCreateForm from "railway/containers/Sites/Form/Create"
import UserEditForm from "railway/containers/Users/Update"
import LoginForm from "railway/containers/Forms/LoginForm"
import HorizontalMenuContainer from "railway/containers/Menus/Horizontal"
import { Route } from "react-router-dom"
import { checkAuth } from "railway/store/actions/auth"

import Home from "railway/components/Home"

const AppLayout = ({ user, loggedIn, checkAuth }) => {
	if (!loggedIn) {
		checkAuth()
		return (
			<div style={{ padding: 70 }} >
				<h1 style={{ fontSize: 80 }}>Railway.</h1>
				<h1>Manage your studio.</h1>
				<h3>Log In</h3>
				<LoginForm />
				<br />
				<p>Don't have an account? <a>Sign up</a></p>
			</div>
		)
	}
	if (user.get("role") === "admin") {
		return (
			<Layout style={{ height: "100vh" }}>
				<Row>
					<Col>
						<HorizontalMenuContainer />
					</Col>
				</Row>
				<Layout>
					<Route path="/" component={Home} />
					<Route exact path="/admin/clients/all" component={ClientsContainer} />
					<Route exact path="/admin/clients/:id/update/" component={ClientUpdateForm} />
					<Route exact path="/admin/clients/create" component={ClientCreateForm} />
					<Route exact path="/admin/sites/all" component={SitesContainer} />
					<Route exact path="/admin/sites/:id/update/" component={SiteUpdateForm} />
					<Route exact path="/admin/sites/create" component={SiteCreateForm} />
					<Route exact path="/user/update/:id" component={UserEditForm} />
					<Route exact path="/client/dashboard" component={ClientDashboard} />
				</Layout>
			</Layout>
		)

	}
	if (user.get("role") === "staff") {
		return (
			<Layout style={{ height: "100vh" }}>
				<Row>
					<Col>
						<HorizontalMenuContainer />
					</Col>
				</Row>
				<Layout>
					<Route path="/" component={Home} />
					<Route exact path="/admin/sites/all" component={SitesContainer} />
					<Route exact path="/admin/sites/:id/update" component={SiteUpdateForm} />
					<Route exact path="/admin/sites/create" component={SiteCreateForm} />
					<Route exact path="/user/update/:id" component={UserEditForm} />
					<Route exact path="/client/dashboard" component={ClientDashboard} />
				</Layout>
			</Layout>
		)
	}

	if (user.get("role") === "client") {
		return (
			<Layout style={{ height: "100vh" }}>
				<Row>
					<Col>
						<HorizontalMenuContainer />
					</Col>
				</Row>
				<Layout>
					<Route path="/" component={ClientDashboard} />
					<Route exact path="/" component={SiteSelectorContainer} />
					<Route exact path="/client/dashboard" component={ClientDashboard} />
				</Layout>
			</Layout>
		)
	}
	return <div />
}

function mapStateToProps(state, ownProps) {
	return {
		loggedIn: state.get("auth").get("loggedIn"),
		user: state.get("auth").get("user")
	}
}

function mapDispatchToProps(dispatch) {
	return {
		checkAuth: () => { dispatch(checkAuth()) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout)
