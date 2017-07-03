import React from "react"
import { TreeSelect } from "antd"
import SiteTree from "railway/components/SiteTree"

const TreeNode = TreeSelect.TreeNode


const SiteTreeSelector = (props) => {
	return (
		<TreeSelect
			showSearch
			style={{ width: 300 }}
			dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
			placeholder="Please select"
			allowClear
			treeDefaultExpandAll
		>
			<SiteTree {...props} />
		</TreeSelect>
	)
}


export default SiteTreeSelector
