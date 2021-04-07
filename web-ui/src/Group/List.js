import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetch_user } from '../api.js';

// UNUSED
function GroupListTable({user, session}) {
    if(!session) {
        return (
            <h6>Sign up or login to see your chores!</h6>
        );
    }

    let rows = user.groups.map((grp) => {
        let controls = (
            <span>
                <Link to={"/groups/" + grp.id + "/view"}>View</Link>
            </span>
        );
        if(grp.users.includes(session.user_id)) { // TODO
            controls = (
                <span>
                    <Link to={"/groups/" + grp.id + "/view"}>View</Link>
                    <Link to={"/groups/" + grp.id + "/edit"}>Edit</Link>
                    <Link to={"/groups/" + grp.id +"/delete"}>Delete</Link>
                </span>
            );
        }

        return (
            <tr key={grp.id}>
                <td>{grp.name}</td>
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

function GroupList({session, user}){
    if(user && session) {
        return (<GroupListTable user={user} session={session} />)
    } else if(session) {
        fetch_user(session.user_id);
        return (<h6>Loading Groups</h6>);
    } else {
        return (<h6>Sign up or login to start making chores!</h6>)
    }
}

export default connect(({session, user}) => ({session, user}))(GroupList)
