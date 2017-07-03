import Immutable from "immutable"
import React from "react"
import NinjaForm from "ninja-forms"
import { ValidateStringLength, ValidateStringContains } from "ninja-forms/lib/validators"
import { Button, Form, Icon, Input, Modal } from "antd"
import history from "railway/history"

const UserForm = ({ field, loginAction, isValid, validate, handleSubmit, submit, userID, initialValues }) => {
	if (!initialValues) return <div />
	return (
		<div>
			<form className="user-edit-form" onSubmit={
				handleSubmit(({ values }) => {
					submit(initialValues.merge(Immutable.fromJS(values)))
				})
			}>
				<Form.Item {...isValid("firstName") }>
					<Input
						{...field("firstName", initialValues.get("firstName")) }
						type="text"
						placeholder="Please enter first name"
						prefix={<Icon type="user" style={{ fontSize: 13 }} />}
						label="Name"
					/>
				</Form.Item>
				<Form.Item {...isValid("lastName") }>
					<Input
						{...field("lastName", initialValues.get("lastName")) }
						type="text"
						placeholder="Please enter last name"
						prefix={<Icon type="user" style={{ fontSize: 13 }} />}
						label="Name"
					/>
				</Form.Item>
				<Form.Item {...isValid("email") }>
					<Input
						{...field("email", initialValues.get("email")) }
						type="text"
						placeholder="Please enter a email"
						prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
						label="email"
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						disabled={!isValid()}
					>Save
					</Button>
				</Form.Item>
			</form >
		</div>
	)
}

const UserNinjaForm = NinjaForm({
	name: "user",
	validator: {
		name: ValidateStringLength({
			validateStatus: "error",
			help: "Please enter more than 2 characters"
		}, 2),
		email: ValidateStringContains({
			validateStatus: "error",
			help: "Email address is invalid"
		}, "@", "."),
	}
})(UserForm)

const UserFormModal = (props) => {
	return (
		<Modal
			visible={true}
			title="User"
			wrapClassName="vertical-center-modal"
			footer={null} // Default buttons (Ok, Cancel) are excluded.
			onCancel={() => { history.goBack() }}
		>
			<UserNinjaForm {...props} />
		</Modal >
	)
}

export default UserFormModal
