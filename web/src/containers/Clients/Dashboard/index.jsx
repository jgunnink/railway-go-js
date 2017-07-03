import React from "react"
import ClientDashboard from "railway/components/Clients/Dashboard"
import { connect } from "react-redux"
import {
	archiveUser,
	disableUser,
	enableUser,
	fetchUsers
} from "railway/store/actions/users"
import { fetchSites } from "railway/store/actions/sites"
import { fetchModels } from "railway/store/actions/models"
import { setActiveModel } from "railway/store/actions/viewer"
import Needs from "railway/hoc/needs"

const ClientDashboardModalWithNeeds = Needs({ optimize: true }, [
	{
		name: "users",
		action: fetchUsers,
		path: ["users"]
	},
	{
		name: "sites",
		action: fetchSites,
		path: ["sites"]
	},
	{
		name: "models",
		action: fetchModels,
		path: ["models"]
	}
])(ClientDashboard)

const ClientsDashboardContainer = (props) => {
	return (<ClientDashboardModalWithNeeds {...props } />)
}

const mapStateToProps = (state, ownProps) => {
	return {}
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


