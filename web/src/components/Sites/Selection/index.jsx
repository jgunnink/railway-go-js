import React, { Component } from 'react'
import { Menu, Label, Image, Input, List, Segment } from 'semantic-ui-react'
import { push } from 'react-router-redux'
import { lookAt } from 'orange/helpers/viewer'
import australia from 'orange/components/ModelViewer/australia'
import { Table } from 'semantic-ui-react'

import './list.css'

let timeout

const TableExampleSelectableInvertedRow = ({ siteFilter, filterSites, sites, setGoToLongLat, hoverSite }) => {
	let sitesRows = []

	// Add Australia for easy navigation
	sitesRows.push(
		<Table.Row key={"site-" + i}
			onClick={(e) => {
				e.stopPropagation()
				lookAt(australia)
			}}
			onMouseEnter={(e) => {
				e.stopPropagation()
				clearTimeout(timeout)
			}}
			onMouseLeave={(e) => {
				e.stopPropagation()
				clearTimeout(timeout)
				timeout = setTimeout(() => {
					hoverSite(undefined, undefined, undefined)
				}, 200)
			}}>
			<Table.Cell>Australia</Table.Cell>
		</Table.Row>
	)
	for (var i = 0; i < sites.length; i++) {
		const site = sites[i]
		if (site.name.toUpperCase().includes(siteFilter.toUpperCase())) {
			sitesRows.push(
				<Table.Row key={"site-" + i}
					onClick={() => {
						setGoToLongLat(site.longitude, site.latitude, site.name)
					}}
					onMouseEnter={(e) => {
						e.stopPropagation()
						clearTimeout(timeout)
						hoverSite(site.longitude, site.latitude, site.name)
					}}
					onMouseLeave={(e) => {
						e.stopPropagation()
						clearTimeout(timeout)
						timeout = setTimeout(() => {
							hoverSite(undefined, undefined, undefined)
						}, 200)
					}}>
					<Table.Cell>{site.name}</Table.Cell>
				</Table.Row>
			)
		}
	}

	return (
		<div className="orange--sites-list">
			<div className="dark-input" style={{ float: 'right', marginBottom: 15 }}><Input onChange={(e, input) => {
				filterSites(input.value)
			}} placeholder='Filter...' /></div>
			<Table celled inverted selectable>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Site</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{sitesRows}
				</Table.Body>
			</Table>
		</div>
	)
}

export default TableExampleSelectableInvertedRow
