import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import { fetch_group } from '../api';

function ShowOneGroup({group, session}) {
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

function ShowGroup({group, session}) {
    let match = useRouteMatch();
    let id = match.params.id;
    if(group && group.id === id && group.users.includes(session.user_id)) { // TODO
        return (<ShowOneGroup group={group} session={session}/>);
    } else if(group && group.id === id && session) {
        return (<h6>You don't have access to this group</h6>);
    } else if(session) {
        fetch_group(id);
        return (<h6>Loading group...</h6>);
    } else {
        return (<h6>Sign up or login to see your group!</h6>);
    }
}

export default connect(({group, session}) => ({group, session}))(ShowGroup);
