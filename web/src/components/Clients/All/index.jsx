import React from "react"
import { Icon, Button, Card, Col, Modal as antModal, Row } from "antd"
import { Link } from "react-router-dom"
import history from "railway/history"
import "railway/components/Clients/All/style.css"

const confirm = antModal.confirm

const Clients = (props) => {
	const role = props.role
	const manageClients = ((role === "manager") || (role === "staff") || (role === "admin"))
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
									onClick={() => { history.push(`/client/${client.get("id")}`) }}
								/>
								<div
									className="clients-card-body-text"
									onClick={() => { history.push(`/client/${client.get("id")}`) }}
								>
									<h3>{client.get("name")}</h3>
									<p>{client.get("description")}</p>
								</div>
								{
									manageClients &&
									<div>
										<p style={{ textAlign: "center" }}>
											<EditLink client={client} />
											<span className="ant-divider" />
											<ArchiveLink client={client} {...props} />
										</p>
										<br />
									</div>
								}
							</Card>
						</Col>
					)
				})}

				<Col span={3}>
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
		<Link to={`/clients/${client.get("id")}/update`}>
			<Button shape="circle" icon="edit" />
		</Link>
	)
}

const CreateLink = () => {
	return (
		<Link className="clients-new-link" to={`/clients/create`}>
			<Icon type="plus-circle" />
		</Link>
	)
}

const ClientTable = (props) => {
	return (
		<div>
			<Clients {...props} />
		</div>
	)
}

export default ClientTable

