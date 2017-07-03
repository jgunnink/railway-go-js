import React from "react"
import { Table, Button, Modal as antModal } from "antd"
import { Link } from "react-router-dom"
import ModelTable from "railway/components/ModelTable"

const confirm = antModal.confirm

const SiteTable = (props) => {
	const models = props.models
	let siteMap
	let siteData = []
	try {
		siteMap = props.sites.get("sites")
		siteData = siteMap.map((site, i) => {
			return {
				key: site.get("id"),
				name: site.get("name"),
				description: site.get("description"),
			}
		}).toArray()
	} catch (err) {
		console.log(err)
		siteData = []
	}
	const siteColumns = [{
		title: "Name",
		dataIndex: "name",
		key: "name",
		render: text => <div>{text}</div>,
	}, {
		title: "Description",
		dataIndex: "description",
		key: "description",
	}, {
		title: "Action",
		key: "action",
		render: (text, record) => {
			return (
				<span>
					<EditSiteLink siteID={record.key} {...props} />
					<span className="ant-divider" />
					<ArchiveSiteLink siteID={record.key} {...props } />
				</span>
			)
		}
	}]

	return (
		<div>
			<h2>Sites</h2>
			<Table pagination={{ pageSize: 50 }} scroll={{ y: 800 }} bordered columns={siteColumns} dataSource={siteData} expandedRowRender={(record) => { return <ModelTable record={record} {...props} /> }} />
		</div>
	)
}

const ArchiveSiteLink = ({ siteID, archivesite }) => {
	function showConfirm() {
		confirm({
			title: "Are you sure you want to archive this site?",
			content: "This will archive the site removing them from view. This cannot be undone. Please be certain.",
			onOk() { archivesite(siteID) },
			onCancel() { },
		})
	}
	return (<Button shape="circle" type="danger" icon="delete" onClick={showConfirm} />)
}

const EditSiteLink = ({ siteID }) => {
	return (
		<Link to={`/site/update/${siteID}`}>
			<Button shape="circle" icon="edit" />
		</Link >
	)
}
export default SiteTable
