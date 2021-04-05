import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetch_chores } from '../api';

function ChoreListTable({chores, session}) {
    if(!session) {
        return (
            <h6>Sign up or login to see your chores!</h6>
        );
    }
    let rows = chores.map((ch) => {
        let controls = (
            <span>
                <Link to={"/chores/" + ch.id + "/view"}>View</Link>
            </span>
        );
        if(chores.group.users.includes(session.user_id)){ // TODO
            controls = (
                <span>
                    <Link to={"/chores/" + ch.id + "/view"}>View</Link>
                    <Link to={"/chores/" + ch.id + "/edit"}>Edit</Link>
                    <Link to={"/chores/" + ch.id + "/delete"}>Delete</Link>
                </span>
            );
        }

        return (
            <tr key={ch.chore_id}>
                <td>{ch.name}</td>
                <td>{ch.description}</td>
                <td>{ch.group.name}</td>
                <td>{controls}</td>
            </tr>
        );
    });

    return (
        <Table striped>
            <thead>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Group</th>
                <th scope="col"></th>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
}

function ChoreList({chores, session}) {
    if(chores){
        return (<ChoreListTable chores={chores} session={session} />);
    }else if(session){
        fetch_chores();
        return (<h6>Loading chores...</h6>);
    } else {
        return (<h6>Sign up or login to see your chores!</h6>);
    }
}

export default connect(({chores, session}) => ({chores, session}))(ChoreList);
