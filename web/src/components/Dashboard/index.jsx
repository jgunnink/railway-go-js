import React from "react"
import { Button, Header, Segment } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "../../../assets/css/members.css"

const Dashboard = (props) => {
    const changeActiveScreen = props.changeActiveScreen
  
    return (
        <div><Segment>
            <Header color="orange" as="h1" content="Dashboard" />
            <p>
                This is your Dashboard! As you start to use the application more content will fill out here.
                <br/><br/>
                Possibilities include: customer lists, accounts, projects, etc.
            </p>
            <Link href="/">
                <Button color="orange" content="Back to Homepage" icon="home" labelPosition="right" onClick={()=>{changeActiveScreen("home")}}/>
            </Link>
		</Segment></div>
    )
}

export default Dashboard
