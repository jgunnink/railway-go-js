import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { addNotification, clearNotification } from "../../store/actions/notifications"
import NotificationSystem from "react-notification-system"

class NotificationContainer extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.notificationSystem = this.refs.notificationSystem
	}

	componentWillReceiveProps(newProps) {
		const { message, level } = newProps.notifications

		if (message && level) {
			this.notificationSystem.addNotification({
				message,
				level
			})

			this.props.dispatch((dispatch) => {
				setTimeout(() => {
					dispatch(clearNotification())
				}, 1)
			})
		}
	}

	render() {
		return (
			<NotificationSystem ref="notificationSystem" />
		)
	}
}

function mapStateToProps(state) {
	return {
		notifications: state.get("notifications").toJS()
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		actions: bindActionCreators({
			addNotification,
			clearNotification
		}, dispatch)
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NotificationContainer)
