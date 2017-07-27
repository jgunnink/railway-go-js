import React from "react"
import PasswordReset from "railway/components/Forms/PasswordReset"
import { Col, Row } from "antd"
import { passwordReset } from "railway/store/actions/auth"
import { connect } from "react-redux"

const PasswordResetContainer = props => {
	return (
		<Row style={{ padding: "5%" }}>
			<Col xs={24} sm={24} md={16} lg={12} xl={8}>
				<h1>Reset your password.</h1>
				<PasswordReset {...props} />
			</Col>
		</Row>
	)
}

const mapStateToProps = (state, ownProps) => {
	const uuid = ownProps.match.params.uuid
	return {
		uuid
	}
}

const mapDispatchToProps = dispatch => {
	return {
		passwordReset: (email, password, uuid) => {
			dispatch(passwordReset(email, password, uuid))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetContainer)
