import React from "react"
import NinjaForm from "ninja-forms"
import { Button, Form, Icon, Input, Modal } from "antd"
import { ValidateStringContains, ValidateStringLength } from "ninja-forms/lib/validators"
import history from "railway/history"

const Registration = props => {
	const { field, userRegistration, isValid, handleSubmit } = props
	return (
		<Form
			className="create-user-form"
			onSubmit={handleSubmit(({ values }) => {
				userRegistration(values)
			})}>
			<h3>Given Name</h3>
			<Form.Item {...isValid("name")}>
				<Input
					{...field("firstName", "")}
					type="text"
					placeholder="Given name"
					prefix={<Icon type="user" style={{ fontSize: 13 }} />}
					label="Given Name"
				/>
			</Form.Item>
			<h3>Last Name</h3>
			<Form.Item {...isValid("lastName")}>
				<Input
					{...field("lastName", "")}
					type="text"
					placeholder="Last name"
					prefix={<Icon type="user" style={{ fontSize: 13 }} />}
					label="Last Name"
				/>
			</Form.Item>
			<h3>Email</h3>
			<Form.Item {...isValid("email")}>
				<Input
					{...field("email")}
					type="text"
					placeholder="email@address.com"
					prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
					label="Email Address"
				/>
			</Form.Item>
			<h3>Password</h3>
			<Form.Item {...isValid("password")}>
				<Input
					{...field("password", "")}
					type="password"
					placeholder="Password"
					prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
					label="Password"
				/>
			</Form.Item>
			<Form.Item>
				<Button icon="user-add" type="primary" htmlType="submit" disabled={!isValid()}>
					Register!
				</Button>
			</Form.Item>
		</Form>
	)
}

const ValidatePassword = msg => {
	let valid = msg
	return (confirmPasswordValue, allValues) => {
		if (allValues) {
			if (allValues.password !== confirmPasswordValue) {
				valid = msg
			} else {
				valid = true
			}
		}
		return valid
	}
}

const RegistrationNinjaForm = NinjaForm({
	name: "passwordReset",
	validator: {
		email: ValidateStringContains(
			{
				validateStatus: "error",
				help: "Email address is invalid"
			},
			"@",
			"."
		),
		password: ValidateStringLength(
			{
				validateStatus: "warning",
				help: "New password is too short"
			},
			4
		),
		confirmPassword: ValidatePassword(
			{
				validateStatus: "error",
				help: "Passwords do not match"
			},
			ValidatePassword
		)
	}
})(Registration)

const RegistrationModal = props => {
	return (
		<Modal
			visible={true}
			title="Registration"
			wrapClassName="vertical-center-modal"
			footer={null} // Default buttons (Ok, Cancel) are excluded.
			onCancel={() => {
				history.push("/")
			}}>
			<RegistrationNinjaForm {...props} />
		</Modal>
	)
}

export default RegistrationModal
