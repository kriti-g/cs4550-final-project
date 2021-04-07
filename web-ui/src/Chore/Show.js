import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import { fetch_chore } from '../api';

function ShowOneChore({chore, session}) {
    return (
        <Row>
            <Col>
                <ul>
                    <li>
                        <strong>Name:</strong>
                        {chore.name}
                    </li>
                    <li>
                        <strong>Description:</strong>
                        {chore.desc}
                    </li>
                    <li>
                        <strong>Rotation:</strong>
                        {chore.rotation}
                    </li>
                    <li>
                        <strong>Frequency:</strong>
                        {chore.frequency}
                    </li>
                    <li>
                        <strong>Responsible:</strong>
                        <ul>
                            {chore.responsibilities.map((rsp) => {
                                return (
                                    <li>
                                        {rsp.user.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                </ul>
            </Col>
        </Row>
    );
}

function ShowChore({chore, session}){
    let match = useRouteMatch();
    let id = match.params.id;
    if(chore && chore.id === id && chore.group.users.includes(session.user_id)) { // TODO
        return (<ShowOneChore chore={chore} session={session}/>);
    } else if(chore && chore.id === id) {
        return (<h6>You don't have access to this chore</h6>);
    } else if(session && chore === null) {
        fetch_chore(id);
        return (<h6>Loading Chore...</h6>);
    } else {
        return (<h6>You must be signed in to view this chore</h6>);
    }
}


export default connect(({chore, session})=>({chore, session}))(ShowChore); // TODO
