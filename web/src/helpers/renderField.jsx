import React from 'react'
import { Checkbox, Form, Input, Label } from 'semantic-ui-react'

export const renderInput = ({input, label, type, meta: {touched, error}}) => {
	return (
		<Form.Field>
			<label>{label}</label>
			<Input {...input} type={type} />
			{touched && error && <Label basic color='red' pointing>{error}</Label>}
		</Form.Field>
	)
}

export const renderCheckbox = ({input, label, meta: {touched, error}}) => {
	return (
		<Form.Field>
			<Checkbox {...input} value={input.value ? 'true' : 'false'} label={label} checked={input.checked} onChange={(e, value) => input.onChange(value.checked)}/>
			{touched && error && <Label basic color='red' pointing>{error}</Label>}
		</Form.Field>
	)
}
