import React from "react"
import ClientView from "railway/components/Clients/View"
import { connect } from "react-redux"
import Needs from "railway/hoc/needs"
import { archiveSite } from "railway/store/actions/sites"
import { fetchUsers } from "railway/store/actions/users"
import { fetchSites } from "railway/store/actions/sites"

const ClientAdminPanelWithNeeds = Needs({ optimize: true }, [
	{
		name: "users",
		action: fetchUsers,
		path: ["users"]
	},
	{
		name: "sites",
		action: fetchSites,
		path: ["sites"]
	}
])(ClientView)

const ClientViewContainer = (props) => {
	return (
		<ClientAdminPanelWithNeeds {...props} />
	)
}

const mapStateToProps = (state, ownProps) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		// userArchive: (user) => { dispatch(archiveUser(user)) }, // Not currently a function
		siteArchive: (site) => { dispatch(archiveSite(site)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientViewContainer)

