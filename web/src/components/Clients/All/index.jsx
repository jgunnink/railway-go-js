import React from "react"
import { Icon, Button, Card, Col, Modal as antModal, Row } from "antd"
import { Link } from 'react-router-dom'
import { Modal, ModalBody, ModalHeader } from "railway/components/Modal"
import history from "railway/history"
import "railway/components/Clients/All/style.css"

const confirm = antModal.confirm

const Clients = (props) => {
	const loaded = props.clients.get("loaded")
	if (!loaded) {
		return (
			<Row type="flex" justify="start" align="top">
				<Col span={6}>
					<Card
						loading
						bordered={true}
						className="clients-card"
						bodyStyle={{ padding: 0 }}
					>
					</Card>
				</Col>
			</Row>
		)
	}
	const clients = props["clients"].get("clients")
	return (
		<div style={{ background: "#ECECEC" }}>
			<Row type="flex" justify="start" align="top">
				{clients.map((client, i) => {
					return (
						<Col span={6}>
							<Card
								key={client.get("id")}
								bordered={true}
								className="clients-card"
								bodyStyle={{ padding: 0 }}
							>
								<img
									className="clients-card-body-image"
									src={client.get("data").get("avatar")}
									alt="Company logo"
									onClick={() => { history.push("/client/dashboard") }}
								/>
								<div
									className="clients-card-body-text"
									onClick={() => { history.push("/client/dashboard") }}
								>
									<h3>{client.get("name")}</h3>
									<p>{client.get("description")}</p>
								</div>
								<br />
								<p style={{ textAlign: "center" }}>
									<EditLink client={client} />
									<span className="ant-divider" />
									<ArchiveLink client={client} {...props} />
								</p>
								<br />
							</Card>
						</Col>
					)
				})}

				<Col span={6}>
					<CreateLink />
				</Col>
			</Row>
		</div>
	)
}


const ArchiveLink = ({ client, archiveClient }) => {
	function showConfirm() {
		confirm({
			title: "Are you sure you want to archive this client?",
			content: "This will archive the client removing them from view. This cannot be undone. Please be certain.",
			onOk() { archiveClient(client) },
			onCancel() { },
		})
	}
	return (<Button shape="circle" type="danger" icon="delete" onClick={showConfirm} />)
}

const EditLink = ({ client }) => {
	return (
		<Link to={`/admin/clients/update/${client.get("id")}`}>
			<Button shape="circle" icon="edit" />
		</Link>
	)
}

const CreateLink = () => {
	return (
		<Link className="clients-new-link" to={`/admin/clients/create`}>
			<Icon type="plus-circle" />
		</Link>
	)
}

const ClientsModal = (props) => {
	return (
		<Modal
			style={{ minHeight: "80%", minWidth: "80%" }}
			className="client-modal"
			onClose={() => { history.push("/") }}
		>
			<ModalHeader>
				Orange Administration
			</ModalHeader>
			<ModalBody>
				<Clients {...props} />
			</ModalBody>
		</Modal>
	)
}


export default ClientsModal

