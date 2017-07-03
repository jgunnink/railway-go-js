import Immutable from "immutable"
import React from "react"
import NinjaForm from "ninja-forms"
import { ValidateStringLength } from "ninja-forms/lib/validators"
import { Form, Input, Icon, Button } from "antd"
import history from "railway/history"
import { Modal, ModalBody, ModalHeader } from "railway/components/Modal"

const SitesForm = ({ field, loginAction, isValid, validate, handleSubmit, submit, siteID, initialValues }) => {
	if (!initialValues) return <div />
	return (
		<form className="site-form" onSubmit={
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

const SiteNinjaForm = NinjaForm({
	name: "site",
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
})(SitesForm)

const SitesFormModal = (props) => {
	return (
		<Modal onClose={() => { history.push('/admin/sites/all') }}>
			<ModalHeader>
				Save Site
	  		</ModalHeader>
			<ModalBody>
				<SiteNinjaForm {...props} />
			</ModalBody>
		</Modal>
	)
}



export default SitesFormModal
