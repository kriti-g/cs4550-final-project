import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

function ShowChore({chore}) {
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
                        {chore.description}
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
                        <strong>Group:</strong>
                        {chore.group.name}
                    </li>
                    <li>
                        <strong>Responsible:</strong>
                        <ul>
                            {chore.responsible.map((rsp) => {
                                return (
                                    <li>
                                        {rsp.name}
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


export default connect(({chore})=>({chore}))(ShowChore);
