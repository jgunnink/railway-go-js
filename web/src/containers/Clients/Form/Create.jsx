import React from "react"
import Immutable from 'immutable'
import ClientsForm from "railway/components/Clients/Form"
import { connect } from "react-redux"
import { createClient } from "railway/store/actions/clients"

const ClientsFormContainer = (props) => {
	return <ClientsForm {...props} />
}

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: Immutable.fromJS({
			name: "",
			description: "",
		})
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		submit: (clientID, client) => { dispatch(createClient(clientID, client)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsFormContainer)
