import React from "react"
import Horizontal from "railway/components/Menu/Horizontal"
import { logout } from "railway/store/actions/auth"
import { setActiveScreen } from "railway/store/actions/ui"
import { fetchSites } from "railway/store/actions/sites"
import { fetchModels } from "railway/store/actions/models"
import { setActiveModel } from "railway/store/actions/viewer"
import Needs from "railway/hoc/needs"
import { connect } from "react-redux"

const HorizontalWithNeeds = Needs({ optimize: true }, [
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
])(Horizontal)

const HorizontalContainer = (props) => {
	return <HorizontalWithNeeds {...props} />
}

const mapStateToProps = (state, ownProps) => {
	const activeScreen = state.get("ui").get("activeScreen")
	const role = state.get("auth").get("user").get("role")
	return {
		activeScreen,
		role,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setActiveModel: (model) => { dispatch(setActiveModel(model)) },
		logout: () => { dispatch(logout()) },
		setActiveScreen: (key) => { dispatch(setActiveScreen(key)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalContainer)
