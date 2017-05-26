import React from "react"
import { Header, Image, Table } from "semantic-ui-react"
import ImageNanda from "./images/avatar/small/lena.png"

const UserRow = (props) => {
	return (
		<Table.Row>
			<Table.Cell>
				<Header as="h4" image>
					<Image src={ImageNanda} shape="rounded" size="mini" />
					<Header.Content>
						{props.user.firstName} {props.user.lastName}
						<Header.Subheader>{props.user.data.occupation}</Header.Subheader>
					</Header.Content>
				</Header>
			</Table.Cell>
			<Table.Cell>
				22
			</Table.Cell>
		</Table.Row>
	)
}

const UserTable = (props) => {
	const users = props.users.toJS()

	return (
		<Table basic="very" celled collapsing>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Employee</Table.HeaderCell>
					<Table.HeaderCell>Correct Guesses</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					users.map((el)=>{
						return <UserRow user={el} key={el.id} />
					})
				}
			</Table.Body>
		</Table>
	)
}

export default UserTable
