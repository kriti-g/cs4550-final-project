import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function UserList({users, session}) {
    let rows = users.map((usr) => {
        let controls = null;
        if(session.user_id === usr.user_id){
            controls = (
                <span>
                    <Link to={""}>Edit</Link>
                </span>
            );
        }

        return (
            <tr key={usr.user_id}>
                <td>{usr.name}</td>
                <td>{controls}</td>
            </tr>
        );
    });

    return (
        <Table striped>
            <thead>
                <th scope="col">Name</th>
                <th scope="col"></th>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
}

export default connect(({users, session}) => ({users, session}))(UserList);
