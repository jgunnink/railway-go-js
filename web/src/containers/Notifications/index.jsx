import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { addNotification, clearNotification } from "../../store/actions/notifications"
import NotificationSystem from "react-notification-system"

class NotificationContainer extends React.Component {
	componentDidMount() {
		this.notificationSystem = this.refs.notificationSystem
	}

	componentDidUpdate(prevProps) {
		if (this.props.notifications !== prevProps.notifications) {
			const { message, level } = this.props.notifications.toJS()
			if (message && level) {
				this.notificationSystem.addNotification({
					message,
					level
				})
				this.props.dispatch(clearNotification())
			}
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
		notifications: state.railway.notifications
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
