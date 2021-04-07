import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// UNUSED
function RespList({resps, session}) {
    let rows = resps.map((resp) => {
        let controls = null;
        if(false){ // TODO
            controls = (
                <span>
                    <Link to={""}>Edit</Link>
                </span>
            );
        }

        return (
            <tr key={resp.id}>
                <td>{resp.chore.name}</td>
                <td>{resp.deadline}</td>
                <td>{resp.completions}</td>
                <td>{controls}</td>
            </tr>
        );
    });

    return (
        <Table striped>
            <thead>
                <th scope="col">Chore</th>
                <th scope="col">Deadline</th>
                <th scope="col">Times Completed</th>
                <th scope="col"></th>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
}

export default connect(({resps, session}) => ({resps, session}))(RespList);
