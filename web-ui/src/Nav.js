import { Alert, Button, Container, Col, Form, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';
import { api_login } from './api';

function Link({to, children}) {
  return (
    <Nav.Item>
      <NavLink to={to} exact className="nav-link" activeClassName="active">
        {children}
      </NavLink>
    </Nav.Item>
  );
}

let SessionInfo = connect()(({session, dispatch}) => {
    function logout() {
        dispatch({type: "session/clear"})
    }

    return (
        <Nav>
            <Link to="/group">My Group</Link>

            <Navbar.Text>
                User: {session.name} &nbsp;
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
        api_login(email, password);
    }
    return (
        <Nav>
            <Link to="/users/new">Register</Link>
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
                    Log In
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
    console.log("AppNav", error)
    let error_row = null;
    if(error) {
        error_row = (<Alert variant="danger">{error}</Alert>)
    }

    return (
        <Container>
            <Row>
                <Navbar variant="light">
                    <Nav>
                        <Link to="/">Home</Link>
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

export default connect(({error})=>({error}))(AppNav)
