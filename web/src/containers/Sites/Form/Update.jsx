import React from "react"
import SitesForm from "railway/components/Sites/Form"
import { connect } from "react-redux"
import { updateSite } from "railway/store/actions/sites"

const SitesFormContainer = (props) => {
	return <SitesForm {...props} />
}

const mapStateToProps = (state, ownProps) => {
	const siteID = ownProps.match.params.id
	const site = state.get("sites").get("sites").get(siteID)
	return {
		initialValues: site,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		submit: (site) => { dispatch(updateSite(site)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SitesFormContainer)
