import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import { fetch_user } from '../api';

function ShowOneUser({user, session}) {
    // TODO: whats public
    let controls= null;
    if(user.id === session.user_id) {
        controls = (
            <li>
                <Link to={"/users/" + user.id + "/edit"}>Edit</Link>
                <Link to={"/users/" + user.id + "/delete"}>Delete</Link>
            </li>
        );
    }
    return (
        <Row>
            <Col>
                <ul>
                    <li>
                        <strong>Name:</strong>
                        {user.name}
                    </li>
                    {controls}
                </ul>
            </Col>
        </Row>
    );
}

function ShowUser({user, session}) {
    let match = useRouteMatch();
    let id = match.params.id;
    if(user && user.id === id && session) {
        return (<ShowOneUser user={user} session={session} />)
    } else if(session) {
        fetch_user(id)
        return (<h6>Loading User</h6>);
    } else {
        return (<h6>Sign up to see other users!</h6>);
    }
}


export default connect(({user, session})=>({user, session}))(ShowUser); // TODO
