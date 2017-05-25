import React from "react"
import { Header, Image, Table } from "semantic-ui-react"
import ImageNanda from "./images/avatar/small/lena.png"
import ImageAdam from "./images/avatar/small/mark.png"
import ImageNeil from "./images/avatar/small/matthew.png"
import ImageBella from "./images/avatar/small/lindsay.png"

const UserTable = () => {
	return (
		<Table basic="very" celled collapsing>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Employee</Table.HeaderCell>
					<Table.HeaderCell>Correct Guesses</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell>
						<Header as="h4" image>
							<Image src={ImageNanda} shape="rounded" size="mini" />
							<Header.Content>
								Nanda
								<Header.Subheader>Creative Director</Header.Subheader>
							</Header.Content>
						</Header>
					</Table.Cell>
					<Table.Cell>
						22
					</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>
						<Header as="h4" image>
							<Image src={ImageAdam} shape="rounded" size="mini" />
							<Header.Content>
								Adam
								<Header.Subheader>Lead Animator</Header.Subheader>
							</Header.Content>
						</Header>
					</Table.Cell>
					<Table.Cell>
						15
					</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>
						<Header as="h4" image>
							<Image src={ImageNeil} shape="rounded" size="mini" />
							<Header.Content>
								Neil
								<Header.Subheader>Animator</Header.Subheader>
							</Header.Content>
						</Header>
					</Table.Cell>
					<Table.Cell>
						12
					</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>
						<Header as="h4" image>
							<Image src={ImageBella} shape="rounded" size="mini" />
							<Header.Content>
								Bella
								<Header.Subheader>Editor</Header.Subheader>
							</Header.Content>
						</Header>
					</Table.Cell>
					<Table.Cell>
						11
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table>
	)
}

export default UserTable
