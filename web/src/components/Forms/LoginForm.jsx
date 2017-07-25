import React from "react"
import NinjaForm from "ninja-forms"
import history from "railway/history"
import { Form, Icon, Input, Button, Checkbox } from "antd"
import { ValidateStringContains, ValidateStringLength } from "ninja-forms/lib/validators"

const LoginForm = ({ field, login, isValid, validate, handleSubmit }) => {
	return (
		<div>
			<h1 style={{ fontSize: 80 }}>Railway.</h1>
			<h1>Manage your studio.</h1>
			<h3>Log In</h3>
			<Form
				className="login-form"
				onSubmit={handleSubmit(({ values }) => {
					login(values.email, values.password)
				})}>
				<Form.Item {...isValid("email")}>
					<Input
						{...field("email", "admin@example.com")}
						type="text"
						placeholder="name@email.com"
						prefix={<Icon type="user" style={{ fontSize: 13 }} />}
						label="Email Address"
					/>
				</Form.Item>
				<Form.Item {...isValid("password")}>
					<Input
						{...field("password", "password")}
						type="password"
						placeholder="password"
						prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
						label="Password"
					/>
				</Form.Item>
				<Form.Item>
					<div>
						<Checkbox {...field("remember_me", true)}>Remember me</Checkbox>
						<a className="login-form-forgot">Forgot password</a>
					</div>
					<div>
						<Button icon="login" type="primary" htmlType="submit" disabled={!isValid()}>
							Log in
						</Button>
						<span className="ant-divider" />
						Don't have an account?{" "}
						<Button
							icon="edit"
							type="default"
							onClick={() => {
								history.push("/register")
							}}>
							Register now!
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	)
}

export default NinjaForm({
	name: "login",
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
				help: "Password is too short"
			},
			4
		)
	}
})(LoginForm)
