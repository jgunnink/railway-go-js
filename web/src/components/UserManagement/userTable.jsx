import React from "react"
import { Button, Header, Image, Table } from "semantic-ui-react"
import ImageLena from "./images/avatar/small/lena.png"

const UserTable = (props) => {
	const users = props.users.toJS()
	const archiveUser = props.archiveUser

	return (
		<Table basic="very" celled collapsing>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>User</Table.HeaderCell>
					<Table.HeaderCell>Email</Table.HeaderCell>
					<Table.HeaderCell>Actions</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					users.map((user, dispatch) => {
						return <UserRow
							user={user}
							key={user.id}
							{...props}
							archiveUser={() => { archiveUser(user.id) }}
						/>
					})
				}
			</Table.Body>
		</Table>
	)
}

const UserRow = (props) => {
	const user = props.user
	const fullName = `${user.firstName} ${user.lastName}`
	const email = user.email
	return (
		<Table.Row>
			<Table.Cell>
				<Header as="h4" image>
					<Image src={ImageLena} shape="rounded" size="mini" />
					<Header.Content>
						{fullName}
						<Header.Subheader>{props.user.data.occupation}</Header.Subheader>
					</Header.Content>
				</Header>
			</Table.Cell>
			<Table.Cell>
				{email}
			</Table.Cell>
			<Table.Cell>
				<Button
					primary
					size="mini"
					icon="pencil"
					content="Edit"
					onClick={() => { props.push(`/admin/usermanagement/${user.id}`) }}
				/>
				<Button
					negative
					size="mini"
					icon="archive"
					content="Archive"
					onClick={() => {
						const r = confirm("Are you sure you want to archive " + fullName + " (" + email + ")?")
						if (r) props.archiveUser()
					}}
				/>
			</Table.Cell>
		</Table.Row>
	)
}

export default UserTable
