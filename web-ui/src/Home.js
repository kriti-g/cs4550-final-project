import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetch_user, update_bulk_responsibilites } from './api';
import {
  join_group_channel,
  channel_signal,
  check_channel,
  reset_cb_bindings
} from "./socket"
import store from "./store"

function Home({session, user}) {
  let home = null;
  function mark_complete(resp) {
    let new_completions = resp.completions + 1;
    let params = Object.assign({}, resp);
    params["chore_id"] = resp.chore.id;
    params["completions"] = new_completions;
    update_bulk_responsibilites(params).then((rsp) => {
      if (rsp.error) {
        store.dispatch({ type: "error/set", data: rsp.error });
      } else {
        // update this chore
        channel_signal()
      }
    });
  }

  if (!check_channel() && session && user) {
    join_group_channel(session.user_id, user.group_id)
  }
  if (check_channel()) {
    reset_cb_bindings();
  }

  if(user) {
    let chores_rows = user.responsibilities.map((resp) => {
      return (
        <tr key={resp.id}>
        <td><Link to={"/chores/" + resp.chore.id}>{resp.chore.name}</Link></td>
        <td>{resp.deadline}</td>
        <td><Button
        variant="success"
        onClick={(ev) => mark_complete(resp)}>
        Mark complete
        </Button></td>
        </tr>
      );
    });
    let chores_table = (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Chore</th>
            <th>Deadline</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{chores_rows}</tbody>
      </Table>
    );
    home = (
      <>
      <h3>Responsibilities</h3>
      {chores_table}
      </>
    );
  } else if (session) {
    fetch_user(session.user_id);
    home = (<h5>Loading user details...</h5>);
  } else {
    home = (<h5>Make an account to begin coordinating your chores!</h5>);
  }
  return home;
}

export default connect(({session, user}) => ({session, user}))(Home);
