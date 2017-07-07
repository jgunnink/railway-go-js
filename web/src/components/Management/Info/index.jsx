import React from "react"
import { Timeline, Row } from "antd"

const ClientInfo = (props) => {
	return (
		<div>
			<Row>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt ratione dolor repudiandae quis ullam voluptatum laborum nihil nemo animi omnis, suscipit adipisci, eum nulla quos voluptas accusamus sunt iusto asperiores!
			</Row>
			<br />
			<Row>
				<Timeline>
					<Timeline.Item><b>2015-09-01</b>: Create a services site</Timeline.Item>
					<Timeline.Item><b>2015-09-07</b>: Solve initial network problems</Timeline.Item>
					<Timeline.Item><b>2015-09-16</b>: Technical testing</Timeline.Item>
					<Timeline.Item><b>2015-09-24</b>: Network problems being solved</Timeline.Item>
				</Timeline>
			</Row>
		</div>
	)
}


export default ClientInfo
