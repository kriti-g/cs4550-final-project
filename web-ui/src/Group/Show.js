import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

function ShowGroup({group, session}) {
    let member_list = group.users.map((usr) => {
        return (
            <li>
                {usr.name}
            </li>
        );
    });
    let chore_list = group.chores.map((chr) => {
        return (
            <li>
                {chr.name}
            </li>
        );
    });
    return (
        <div>
            <Row>
                <Col>
                    <h2>{group.name}</h2>
                    <ul>
                        {member_list}
                    </ul>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ul>
                        {chore_list}
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default connect(({group, session}) => ({group, session}))(ShowGroup); // TODO
