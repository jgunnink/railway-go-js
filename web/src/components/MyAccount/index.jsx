import React from "react"
import { Header, Segment } from "semantic-ui-react"

const Account = (props) => {  
    return (
        <Segment>
            <Header color="orange" as="h1" content="Account" />
            <p>This is your Account!</p>
		</Segment>
    )
}

export default Account
