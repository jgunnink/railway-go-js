import React from "react"
import ThingsModal from "railway/components/Sites/All"
import { connect } from "react-redux"
import { fetchSites, archiveSite } from "railway/store/actions/sites"
import Needs from "railway/hoc/needs"

const ThingsModalWithNeeds = Needs({ optimize: true }, [{
	name: "sites",
	action: fetchSites,
	path: ["sites"]
}])(ThingsModal)

const SitesContainer = (props) => {
	const thingNamePlural = "sites"
	const thingNameSingular = "site"

	return (<ThingsModalWithNeeds {...props }
		thingNamePlural={thingNamePlural}
		thingNameSingular={thingNameSingular}
	/>)
}

const mapStateToProps = (state, ownProps) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		thingArchiveAction: (site) => { dispatch(archiveSite(site)) },
		thingFetchAction: fetchSites
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SitesContainer)

