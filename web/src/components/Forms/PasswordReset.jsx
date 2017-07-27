import React from "react"
import NinjaForm from "ninja-forms"
import { Form, Icon, Input, Button } from "antd"
import { ValidateStringContains, ValidateStringLength } from "ninja-forms/lib/validators"

const PasswordReset = ({ field, passwordReset, isValid, validate, handleSubmit, uuid }) => {
	return (
		<Form
			onSubmit={handleSubmit(({ values }) => {
				passwordReset(values.email, values.password, uuid)
			})}>
			<p>Enter your current email address</p>
			<Form.Item {...isValid("email")}>
				<Input
					{...field("email")}
					type="text"
					placeholder="name@email.com"
					prefix={<Icon type="user" style={{ fontSize: 13 }} />}
					label="Email Address"
				/>
			</Form.Item>
			<p>New password</p>
			<Form.Item {...isValid("password")}>
				<Input
					{...field("password", "password")}
					type="password"
					prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
					label="Password"
				/>
			</Form.Item>
			<Form.Item>
				<Button icon="login" type="primary" htmlType="submit" disabled={!isValid()}>
					Reset password
				</Button>
			</Form.Item>
		</Form>
	)
}

export default NinjaForm({
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
		)
	}
})(PasswordReset)
