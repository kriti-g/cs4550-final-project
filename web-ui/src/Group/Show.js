import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import { fetch_group, fetch_user } from '../api';

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

function ShowGroup({group, user, session}) {
    if (session && user && group && group.id === user.group_id) {
      return (<ShowOneGroup group={group} session={session}/>);
    } else if (session && user && group) {
      // somehow there is a cached group that the user can't access???
      return (<h6>You don't have access to this group. Please try logging out and logging in.</h6>);
    } else if (session && user && user.group_id && user.group_id > 0) {
      fetch_group(user.group_id);
      return (<h6>Loading group...</h6>);
    } else if (session && user && (!user.group_id || user.group_id < 0)) {
      return (<h6>Make or join a group to see it here!</h6>);
    } else if (session) {
      fetch_user(session.user_id);
      return (<h6>Loading user info...</h6>);
    } else {
      return (<h6>Sign up or login to see your group!</h6>);
    }
}

export default connect(({group, user, session}) => ({group, user, session}))(ShowGroup);
