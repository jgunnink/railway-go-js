import React from "react"
import SiteTree from "railway/components/SiteTree"
import { connect } from "react-redux"
import { fetchSites } from "railway/store/actions/sites"
import { fetchModels } from "railway/store/actions/models"
import Needs from "railway/hoc/needs"
import "railway/containers/SiteSelector/style.css"

const SiteSelectorWithNeeds = Needs({ optimize: true }, [
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
])(SiteTree)

const SiteSelectorContainer = (props) => {
	return (
		<div className="sidebar">
			<SiteSelectorWithNeeds {...props } />
		</div>
	)
}

const mapStateToProps = (state, ownProps) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteSelectorContainer)

