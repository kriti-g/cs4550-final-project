import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function ChoreList({chores, session}) {
    let rows = chores.map((ch) => {
        let controls = null;
        if(false){ // TODO
            controls = (
                <span>
                    <Link to={""}>Edit</Link>
                </span>
            );
        }

        return (
            <tr key={ch.chore_id}>
                <td>{ch.name}</td>
                <td>{ch.description}</td>
                <td>{controls}</td>
            </tr>
        );
    });

    return (
        <Table striped>
            <thead>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col"></th>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
}

export default connect(({chores, session}) => ({chores, session}))(ChoreList);
