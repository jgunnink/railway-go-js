import React from "react"
import { Tabs } from "antd"
import { Modal, ModalBody, ModalHeader } from "railway/components/Modal"
import ClientInfo from "railway/components/Clients/Info"
import SiteTree from "railway/components/SiteTree"
import UserTable from "railway/components/UserTable"
import history from "railway/history"
import "railway/components/Clients/Dashboard/style.css"

const ClientDashboard = (props) => {
	return (
		<Tabs defaultActiveKey="1">
			<Tabs.TabPane tab="Info" key="1"><ClientInfo /></Tabs.TabPane>
			<Tabs.TabPane tab="Sites" key="2"><SiteTree {...props} /></Tabs.TabPane>
			<Tabs.TabPane tab="Users" key="4"><UserTable {...props} /></Tabs.TabPane>
		</Tabs >
	)
}


const ClientDashboardModal = (props) => {
	return (
		<Modal
			style={{ minHeight: "80%", minWidth: "80%", padding: "50px" }}
			className="clientdashboard-modal"
			onClose={() => { history.push("/") }}
		>
			<ModalHeader>
				Client Admin Dashboard
			</ModalHeader>
			<ModalBody>
				<ClientDashboard {...props} />
			</ModalBody>
		</Modal>
	)
}

export default ClientDashboardModal

