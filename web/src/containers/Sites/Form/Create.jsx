import React from "react"
import Immutable from 'immutable'
import SitesForm from "railway/components/Sites/Form"
import { connect } from "react-redux"
import { createSite } from "railway/store/actions/sites"

const SitesFormContainer = (props) => {
	return <SitesForm {...props} />
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
		submit: (siteID, site) => { dispatch(createSite(siteID, site)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SitesFormContainer)
