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
					<Table.HeaderCell>Employee</Table.HeaderCell>
					<Table.HeaderCell>Email</Table.HeaderCell>
					<Table.HeaderCell>Actions</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					users.map((user)=>{
						return <UserRow 
							user={user}
							key={user.id}
							archiveUser={() => {archiveUser(user.id)}} 
						/>
					})
				}
			</Table.Body>
		</Table>
	)
}

const UserRow = (props) => {
	return (
		<Table.Row>
			<Table.Cell>
				<Header as="h4" image>
					<Image src={ImageLena} shape="rounded" size="mini" />
					<Header.Content>
						{props.user.firstName} {props.user.lastName}
						<Header.Subheader>{props.user.data.occupation}</Header.Subheader>
					</Header.Content>
				</Header>
			</Table.Cell>
			<Table.Cell>
				{props.user.email}
			</Table.Cell>
			<Table.Cell>
				{/*<Button size="mini">Edit</Button>*/}
				<Button 
					negative size="mini" 
					icon="archive" 
					content="Archive" 
					onClick={()=> {
						const r = confirm("Are you sure?")
							if (r) props.archiveUser()
					}} 
				/>
			</Table.Cell>
		</Table.Row>
	)
}

export default UserTable
