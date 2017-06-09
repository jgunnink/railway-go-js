import React from "react"
import { Button, Form, Icon, Segment } from "semantic-ui-react"
import { connect } from 'react-redux'
import { Modal, ModalActions, ModalBody, ModalHeader } from "../../components/Modals"
import { Field, reduxForm } from "redux-form/immutable"
import { renderInput, renderHidden } from "../../helpers/renderField"
import validateEmail from "./validate"
import { push } from "redux-little-router"
import { SubmissionError } from "redux-form"
import { adminAccountUpdate } from "../../store/actions/accountUpdate"

const EditUser = (props) => {
	const fullName = `${props.user.firstName} ${props.user.lastName}`
	return (
		<Modal onClose={() => { props.push("/admin/usermanagement/") }}><Segment>
			<ModalHeader>
				<h1>{`Editing ${fullName}`}</h1>
				<p>{`Update details about ${props.user.firstName} here.`}</p>
	  		</ModalHeader>
			<ModalBody>
				<AccountDetailsForm {...props} initialValues={{id: props.user.id}} />
			</ModalBody>
			<ModalActions>
				<Button color="red" onClick={() => {props.push(`/admin/usermanagement/`)}}><Icon name="remove" /> Cancel</Button>
			</ModalActions>
		</Segment></Modal>
	)
}

const submit = (values, dispatch, props) => {
	console.log(values.toJS())
	return props.adminAccountUpdate(dispatch, values)
		.then((res) => { })
		.catch((err) => {
			throw new SubmissionError({ email: "Please use another email address" })
		})
}

const AccountDetailsForm = reduxForm({ form: "adminAccountUpdate", validateEmail })(({ errorCode, handleSubmit, pristine, submitting, user }) => (
	<Form onSubmit={handleSubmit(submit)}>
		<Field name="first" label="First Name" component={renderInput} />
		<Field name="last" label="Last Name" component={renderInput} />
		<Field name="email" label="Email Address" component={renderInput} />
		<Field name="id" type="hidden" component={renderHidden} />
		<Button color="green" disabled={pristine || submitting} type="submit"><Icon name="checkmark" /> Save</Button>
	</Form>
))

const mapStateToProps = (state, ownProps) => {
	let user
    let user_id = state.router.params.id
    let users = state.railway.users.get("list").toJS()
	for (let index = 0; index < users.length; index++) {
		user = users[index];
		if (user.id === parseInt(user_id, 10)) break
	}
    return {
        user
    }
}

const mapDispatchToProps = (dispatch) => {
    return { 
		adminAccountUpdate: adminAccountUpdate,
		push: (url) => { dispatch(push(url)) }
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
