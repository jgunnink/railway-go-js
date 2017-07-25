import React from "react"
import ClientsModal from "railway/components/Clients/All"
import { connect } from "react-redux"
import { fetchClients, archiveClient } from "railway/store/actions/clients"
import Needs from "railway/hoc/needs"

const ClientsModalWithNeeds = Needs({ optimize: true }, [{
	name: "clients",
	action: fetchClients,
	path: ["clients"]
}])(ClientsModal)

const ClientsContainer = (props) => {
	return (<ClientsModalWithNeeds {...props } />)
}

const mapStateToProps = (state, ownProps) => {
	const role = state.get("auth").get("user").get("role")
	return {
		role
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		archiveClient: (client) => { dispatch(archiveClient(client)) },
		fetchClients: fetchClients
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsContainer)

