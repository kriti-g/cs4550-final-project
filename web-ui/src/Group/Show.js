import { Col, Row, Form, Button, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import ResponsibilityModal from "../Responsibility/Modal";
import store from "../store";

import {
  fetch_group,
  fetch_user,
  update_user,
  delete_invite,
  create_invite,
} from "../api";

function ShowOneGroup({ group, session }) {
  const [modalState, setModalState] = useState({
    modalShow: false,
  });

  let member_list = group.users.map((usr) => {
    return <li key={usr.id}>{usr.name}</li>;
  });
  // let chore_list = group.chores.map((chr) => {
  //   return <li>{chr.name}</li>;
  // });
  let invite_list = group.invites.map((inv) => {
    return <li key={inv.id}>{inv.user.name}</li>;
  });

  // TODO: chores details page is broken. infinite api call?
  let chores_rows = group.chores.map((chr) => {
    let assignee = "";
    let resp_l = chr.responsibilities.length;
    chr.responsibilities.forEach((r, idx) => {
      if (resp_l - 1 === idx) {
        assignee += r.user.name;
      } else {
        assignee += r.user.name + ", ";
      }
    });
    if (resp_l === 0) {
      assignee = "N/A";
    }
    let deadline = resp_l === 0 ? "N/A" : chr.responsibilities[0].deadline;

    return (
      <tr key={chr.id}>
        <td>
          <Link to={"/chores/" + chr.id}> {chr.name}</Link>
        </td>
        <td>{assignee}</td>
        <td>{deadline}</td>
        <td>
          <Button
            variant="primary"
            onClick={() =>
              setModalState({
                chore: chr,
                modalShow: true,
                group_id: group.id,
              })
            }
          >
            Assign
          </Button>
        </td>
      </tr>
    );
  });

  let chores_table = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Chore</th>
          <th>Currently Assigned</th>
          <th>Deadline</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{chores_rows}</tbody>
    </Table>
  );

  if (group.chores.length === 0) {
    chores_table = <div>No chores created.</div>;
  }

  const refetch_group = (group_id) => {
    console.log("refetch group", group_id);
    fetch_group(group_id);
  };

  return (
    <div>
      <Row>
        <Col>
          <h2>{group.name}</h2>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col sm={8}>
          <h5>
            Chores
            <span>
              <Link to={"/chores/new/"}> [Add +]</Link>
            </span>
          </h5>
          {chores_table}
        </Col>
        <Col sm={4}>
          <NewInvite group={group} />
          <h5>Members</h5>
          <ul>{member_list}</ul>
          <h5>Pending Invites</h5>
          <ul>{invite_list}</ul>
        </Col>
      </Row>

      <ResponsibilityModal
        show={modalState.modalShow}
        chore={modalState.chore}
        users={group.users}
        group_id={group.id}
        // refetch_group={refetch_group} // browser complains... invalid value for prop .. might be react bootstrap outdated.
        onHide={() => setModalState({ ...modalState, modalShow: false })}
      />
    </div>
  );
}

function NewInvite({ group }) {
  let [inv, setInvite] = useState({});

  function onSubmit(ev) {
    ev.preventDefault();
    inv["group_id"] = group.id;
    create_invite(inv).then((rsp) => {
      if (rsp.error) {
        // if receiving an error, display it.
        store.dispatch({ type: "error/set", data: rsp.error });
      } else {
        // update this group
        fetch_group(group.id);
      }
    });
  }

  function updateEmail(ev) {
    let i1 = Object.assign({}, inv);
    i1["user_email"] = ev.target.value;
    setInvite(i1);
  }

  return (
    <Row>
      <Col>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Control
              type="email"
              placeholder="Type a new invitee's email..."
              onChange={(email) => {
                updateEmail(email);
              }}
              value={inv.user_email}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Invite
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

function NewGroupOption({ user }) {
  let history = useHistory();

  function joinGroup(group_id, inv_id) {
    let update_params = { id: user.id, group_id: group_id };
    update_user(update_params).then((rsp) => {
      if (rsp.error) {
        // if receiving an error, display it.
        store.dispatch({ type: "error/set", data: rsp.error });
      } else {
        // delete the accepted invite
        delete_invite(inv_id);
        // update this user
        fetch_user(user.id);
      }
    });
  }

  let invite_list = user.invites.map((inv) => {
    return (
      <li key={inv.id}>
        {inv.group.name} -
        <Button
          variant="primary"
          onClick={(ev) => joinGroup(inv.group.id, inv.id)}
        >
          Join
        </Button>
      </li>
    );
  });
  return (
    <div>
      <Row>
        <Col>
          <h6>Make or join a group to see it here!</h6>
          <p>
            <Button
              variant="primary"
              onClick={(ev) => history.push("/groups/new")}
            >
              New Group
            </Button>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h6>Your invites</h6>
          <ul>{invite_list}</ul>
        </Col>
      </Row>
    </div>
  );
}

function ShowGroup({ group, user, session }) {
  if (session && user && group && group.id === user.group_id) {
    return <ShowOneGroup group={group} session={session} />;
  } else if (session && user && group) {
    // jic somehow there is a cached group that the user can't access??? edge case
    return (
      <h6>
        You don't have access to this group. Please try logging out and logging
        in.
      </h6>
    );
  } else if (session && user && user.group_id && user.group_id > 0) {
    fetch_group(user.group_id);
    return <h6>Loading group...</h6>;
  } else if (session && user && (!user.group_id || user.group_id < 0)) {
    return <NewGroupOption user={user} />;
  } else if (session) {
    fetch_user(session.user_id);
    return <h6>Loading user info...</h6>;
  } else {
    return <h6>Sign up or login to see your group!</h6>;
  }
}

export default connect(({ group, user, session }) => ({
  group,
  user,
  session,
}))(ShowGroup);
