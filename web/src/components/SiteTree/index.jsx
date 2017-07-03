/* global isNaN */
import React from "react"
import { /*Button, Modal,*/ Spin, Tree } from "antd"
// import { Link } from "react-router-dom"

// const confirm = Modal.confirm

const SiteTree = ({ sites, models, setActiveModel }) => {
	let siteData
	let modelData
	try {
		siteData = sites.get("sites")
		modelData = models.get("models")
	} catch (err) {
		return <Spin />
	}

	return (
		<Tree
			style={{ margin: 0, padding: 0 }}
			showLine
			onSelect={(e) => {
				if (!isNaN(e[0])) {
					setActiveModel(modelData.get(e[0]))
				}
			}
			}
		>
			{
				siteData.map((site, i) => {
					return (
						<Tree.TreeNode title={site.get("name")} key={site.get("name")}>
							{modelData
								.filter((model, i) => {
									return site.get("id") === model.get("site_id")
								})
								.map((model, i) => {
									return (
										<Tree.TreeNode
											title={model.get("name")}
											key={model.get("id")}
										/>
									)
								})
							}
						</Tree.TreeNode>
					)
				})}
		</Tree>
	)
}

// COMMENTED OUT BECAUSE IT'S NOT IN USE
// const ArchiveSiteLink = ({ siteID, archivesite }) => {
// 	function showConfirm() {
// 		confirm({
// 			title: "Are you sure you want to archive this site?",
// 			content: "This will archive the site removing them from view. This cannot be undone. Please be certain.",
// 			onOk() { archivesite(siteID) },
// 			onCancel() { },
// 		})
// 	}
// 	return (<Button shape="circle" type="danger" icon="delete" onClick={showConfirm} />)
// }

// const EditSiteLink = ({ siteID }) => {
// 	return (
// 		<Link to={`/site/${siteID}/update`}>
// 			<Button shape="circle" icon="edit" />
// 		</Link >
// 	)
// }

export default SiteTree
