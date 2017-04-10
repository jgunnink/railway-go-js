import React from "react"
import { Button, Container, Header } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "../../../assets/css/landing_page.css"

const Dashboard = (props) => {
    const changeActiveScreen = props.changeActiveScreen
  
    return (
        <Container>
            <Header color="orange" as="h1" content="Dashboard" />
            <p style={{color:"white"}}>This is your Dashboard!</p>
            <Link href="/">
                <Button color="orange" content="Back to Homepage" icon="home" labelPosition="right" onClick={()=>{changeActiveScreen("home")}}/>
            </Link>
        </Container>
    )
}

export default Dashboard
