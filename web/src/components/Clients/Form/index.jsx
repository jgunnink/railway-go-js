import Immutable from "immutable"
import React from "react"
import NinjaForm from "ninja-forms"
import "railway/components/Clients/Form/style.css"
import { ValidateStringLength } from "ninja-forms/lib/validators"
import { Button, Form, Input, Icon, Modal } from "antd"
import history from "railway/history"

const ClientsForm = ({ field, loginAction, isValid, validate, handleSubmit, submit, clientID, initialValues }) => {
	if (!initialValues) return <div />
	return (
		<form className="client-form" onSubmit={
			handleSubmit(({ values }) => {
				submit(initialValues.merge(Immutable.fromJS(values)))
			})
		}>
			<Form.Item {...isValid("name") }>
				<Input
					{...field("name", initialValues.get("name")) }
					type="text"
					placeholder="Please enter a name"
					prefix={<Icon type="user" style={{ fontSize: 13 }} />}
					label="Name"
				/>
			</Form.Item>
			<Form.Item {...isValid("description") }>
				<Input
					{...field("description", initialValues.get("description")) }
					type="textarea"
					placeholder="Please enter a description"
					prefix={<Icon type="user" style={{ fontSize: 13 }} />}
					label="Description"
				/>
			</Form.Item>
			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					disabled={!isValid()}
				>
					Save
				</Button>
			</Form.Item>
		</form >
	)
}

const ClientNinjaForm = NinjaForm({
	name: "client",
	validator: {
		name: ValidateStringLength({
			validateStatus: "error",
			help: "Please enter more than 2 characters"
		}, 2),
		description: ValidateStringLength({
			validateStatus: "error",
			help: "Please enter more than 2 characters"
		}, 2),
	}
})(ClientsForm)

const ClientsFormModal = (props) => {
	return (
		<Modal
			visible={true}
			title="User"
			wrapClassName="vertical-center-modal"
			footer={null} // Default buttons (Ok, Cancel) are excluded.
			onCancel={() => { history.push("/management/clients") }}
		>
			<ClientNinjaForm {...props} />
		</Modal>
	)
}



export default ClientsFormModal
