import React from "react"
import Horizontal from "railway/components/Menu/Horizontal"
import { logout } from "railway/store/actions/auth"
import { setActiveScreen } from "railway/store/actions/ui"
import { connect } from "react-redux"

const HorizontalContainer = (props) => {
	return <Horizontal {...props} />
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
		logout: () => { dispatch(logout()) },
		setActiveScreen: (key) => { dispatch(setActiveScreen(key)) }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalContainer)
