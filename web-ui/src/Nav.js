import { Alert, Button, Container, Col, Form, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';

let SessionInfo = connect()(({session}) => {
    function logout() {
        // TODO
    }
    
    return (
        <Nav>
            <NavLink to="">Groups</NavLink>
            <Navbar.Text>
                User: {session.user.name} &nbsp;
            </Navbar.Text>
            <Button variant="outline-secondary" onClick={logout}>Logout</Button>
        </Nav>
    );
});

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function onSubmit(event) {
        event.preventDefault();
        // TODO
    }
    return (
        <Nav>
            <NavLink to="">Register</NavLink>
            <Form onSubmit={onSubmit} inline>
                <Form.Control name="email"
                              type="email"
                              onChange={(ev) => setEmail(ev.target.value)}
                              placeholder="Email"
                              value={email} />
                <Form.Control name="password"
                              type="password"
                    onChange={(ev) => setPassword(ev.target.value)}
                              placeholder="Password"
                              value={password} />
                <Button variant="outline-secondary" type="submit">
                    LogIn
                </Button>
            </Form>
        </Nav>
    );
}

function LOI({session}) {
    if(session) {
        return (<SessionInfo session={session} />);
    } else {
        return (<Login />);
    }
}

const LoginOrLogoutNav = connect(({session}) => ({session}))(LOI);

function AppNav({error}) {
    let error_row = null;
    if(error) {
        error_row = (<Alert variant="danger">{error}</Alert>)
    }

    return (
        <Container>
            <Row>
                <Navbar variant="light">
                    <Nav>
                        <NavLink to="/">Home</NavLink>
                    </Nav>
                    <LoginOrLogoutNav />
                </Navbar>
            </Row>
            <Row>
                <Col>
                    {error_row}
                </Col>
            </Row>
        </Container>
    );
}
