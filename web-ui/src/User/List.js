import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetch_users } from '../api';

function UserListTable({users, session}) {
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

function UserList({users, session}) {
    if(users) {
        return (<UserListTable users={users} session={session} />);
    } else if(session) {
        fetch_users();
        return (<h6>Loading users...</h6>);
    } else {
        return (<h6>Sign up to see other users!</h6>);
    }
}

export default connect(({users, session}) => ({users, session}))(UserList);
