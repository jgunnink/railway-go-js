import React from "react"
import { Button, Card, Col, Modal as antModal, Row } from "antd"
import { Link } from 'react-router-dom'
import { Modal, ModalBody, ModalHeader } from "railway/components/Modal"
import history from "railway/history"

const confirm = antModal.confirm

const Things = (props) => {
	const thingNamePlural = props.thingNamePlural
	const thingNameSingular = props.thingNameSingular
	const things = props[thingNamePlural].get(thingNamePlural)

	return (
		<div style={{ background: "#ECECEC", padding: "30px" }}>
			<Row type="flex" justify="center" align="top">
				{things.map((thing, i) => {
					return (
						<Col>
							<Card
								key={thing.get("id")}
								style={{ padding: 5, margin: 25, width: 300 }}
								bordered={true}
								title={thing.get("name")} extra={
									<div>
										<EditLink thing={thing} {...props} />
										<ArchiveLink thing={thing} {...props} />
									</div>
								}
							>
								<p>{thing.get("description")}</p>
								<br />
								<Link to={`/admin/${thingNamePlural}/create`}>
									<Button
										type="primary"
										shape="circle"
										icon="usergroup-add"
										size="large"
									/>
								</Link>
							</Card>
						</Col>
					)
				})}
				<Card
					title={`Add new ${thingNameSingular}`}
					style={{ padding: 5, margin: 25, width: 300 }}
					bordered={true}
				>
					<div>
						<NewLink {...props} />
					</div>
				</Card>
			</Row>
		</div>
	)
}

const EditLink = ({ thing, thingNamePlural }) => {
	return (
		<Link to={`/admin/${thingNamePlural}/update/${thing.get("id")}`}>
			<Button shape="circle" icon="edit" />
		</Link>
	)
}

const ArchiveLink = ({ thing, thingArchiveAction }) => {
	function showConfirm() {
		confirm({
			title: "Are you sure you want to archive this?",
			content: "This will archive the entity removing them from view. This cannot be undone. Please be certain.",
			onOk() {
				return new Promise((resolve, reject) => {
					setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
					thingArchiveAction(thing)
				}).catch(() => console.log("Oops! Something went wrong"))
			},
			onCancel() { },
		})
	}
	return (
		<Button shape="circle" type="danger" icon="delete" onClick={showConfirm} />
	)
}

const NewLink = ({ thingNameSingular, thingNamePlural }) => {
	return (
		<Link to={`/admin/${thingNamePlural}/create`}>
			<Button type="primary" shape="circle" icon="usergroup-add" size="large" />
		</Link>
	)
}



const ThingsModal = (props) => {
	return (
		<Modal style={{ minWidth: "80%", minHeight: "80%" }} onClose={() => { history.push('/') }}>
			<ModalHeader>
				{`${props.thingNamePlural} Index`}
			</ModalHeader>
			<ModalBody>
				<Things {...props} />
			</ModalBody>
		</Modal>
	)
}


export default ThingsModal

