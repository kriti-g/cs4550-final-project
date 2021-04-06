import { Col, Row, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';

import store from "../store";

import {
  fetch_group,
  fetch_user,
  update_user,
  delete_invite,
  create_invite,
} from "../api";

function ShowOneGroup({group, session, user}) {
  let member_list = group.users.map((usr) => {
    return <li>{usr.name}</li>;
  });
  let chore_list = group.chores.map((chr) => {
    return <li>{chr.name}</li>;
  });
  let invite_list = group.invites.map((inv) => {
    return <li key={inv.id}>{inv.user.name}</li>;
  });
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
              <Link to={"/chores/new/"}>   [Add +]</Link>
            </span>
          </h5>
          <ul>{chore_list}</ul>
        </Col>
        <Col sm={4}>
          <LeaveGroupOption user={user}/>
          <NewInvite group={group} />
          <h5>Members</h5>
          <ul>{member_list}</ul>
          <h5>Pending Invites</h5>
          <ul>{invite_list}</ul>
        </Col>
      </Row>
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
            <Form.Control type="email"
                          placeholder="Type a new member's email..."
                          onChange={email => { updateEmail(email); }}
                          value={inv.user_email} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Invite
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

function LeaveGroupOption({user}) {

  function leave_group() {
    let params = { id: user.id, group_id: -1 };
    update_user(params).then((rsp) => {
      if (rsp.error) {
        // if receiving an error, display it.
        store.dispatch({type: "error/set", data: rsp.error});
      } else {
        // update this user
        store.dispatch({type: "user/set", data: rsp.data})
        // clear group information from cache
        store.dispatch({type: "group/clear", data: null});
      }
    });
  }

  return (
    <p>
      <Button variant="danger" onClick={(ev) => leave_group() }>
        Leave Group
      </Button>
    </p>
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
        //delete_invite(inv_id);
        // update this user
        store.dispatch({type: "user/set", data: rsp.data})
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

function ShowGroup({group, user, session}) {
    if (session && user && group && group.id === user.group_id) {
      return (<ShowOneGroup group={group} session={session} user={user}/>);
    } else if (session && user && group) {
      // jic somehow there is a cached group that the user can't access??? edge case
      return (<h6>You don't have access to this group. Please try logging out and logging in.</h6>);
    } else if (session && user && user.group_id && user.group_id > 0) {
      fetch_group(user.group_id);
      return (<h6>Loading group...</h6>);
    } else if (session && user && (!user.group_id || user.group_id < 0)) {
      return (<NewGroupOption user={user}/>);
    } else if (session) {
      fetch_user(session.user_id);
      return (<h6>Loading user info...</h6>);
    } else {
      return (<h6>Sign up or login to see your group!</h6>);
    }
}

export default connect(({ group, user, session }) => ({
  group,
  user,
  session,
}))(ShowGroup);
