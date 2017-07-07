import React from "react"
import ManagementDashboard from "railway/components/Management/Dashboard"
import { connect } from "react-redux"
import {
	archiveUser,
	disableUser,
	enableUser,
	fetchUsers
} from "railway/store/actions/users"
import { setActiveModel } from "railway/store/actions/viewer"
import Needs from "railway/hoc/needs"

const ManagementDashboardModalWithNeeds = Needs({ optimize: true },
	[{
		name: "users",
		action: fetchUsers,
		path: ["users"]
	}]
)(ManagementDashboard)

const ClientsDashboardContainer = (props) => {
	return (<ManagementDashboardModalWithNeeds {...props } />)
}

const mapStateToProps = (state, ownProps) => {
	const defaultActiveKey = ownProps.match.params.tab || "info"
	return {
		defaultActiveKey
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		archiveUser: (user) => { dispatch(archiveUser(user)) },
		disableUser: (user) => { dispatch(disableUser(user)) },
		enableUser: (user) => { dispatch(enableUser(user)) },
		setActiveModel: (model) => { dispatch(setActiveModel(model)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsDashboardContainer)


