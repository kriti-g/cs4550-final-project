import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

function ShowUser({user}) {
    // TODO: whats public
    return (
        <Row>
            <Col>
                <ul>
                    <li>
                        <strong>Name:</strong>
                        {user.name}
                    </li>
                </ul>
            </Col>
        </Row>
    );
}


export default connect(({user})=>({user}))(ShowUser);
