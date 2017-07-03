import React from "react"
import ClientsForm from "railway/components/Clients/Form"
import { connect } from "react-redux"
import { updateClient } from "railway/store/actions/clients"

const ClientsFormContainer = (props) => {
	return <ClientsForm {...props} />
}

const mapStateToProps = (state, ownProps) => {
	const clientID = ownProps.match.params.id
	const client = state.get("clients").get("clients").get(clientID)
	return {
		initialValues: client
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		submit: (client) => { dispatch(updateClient(client)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsFormContainer)
