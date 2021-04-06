import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import store from "../store";
import { create_group, fetch_user } from '../api';

function GroupNewForm({session, user}) {
    const [group, setGroup] = useState({
        name: "",
        address: ""
    });
    let history = useHistory();

    function onSubmit(event){
      event.preventDefault();
      group["rotation_order"] = "[" + session.user_id + "]";
      create_group(group).then((rsp) => {
        if (rsp.error) {
          // if receiving an error, display it.
          store.dispatch({type: "error/set", data: rsp.error});
        } else {
          // update this user
          fetch_user(session.user_id)
          history.push("/group");
        }
      });
    }

    function update(field, event) {
        let grp = Object.assign({}, group);
        grp[field] = event.target.value;
        setGroup(grp);
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text"
                              onChange={(ev) => update("name", ev)}
                              value={group.name} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control type="text"
                              onChange={(ev) => update("address", ev)}
                              value={group.address} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Save
            </Button>
        </Form>
    );
}



function GroupNew({session, user}){
  if (session && user && !user.group_id) {
    return (<GroupNewForm session={session} user={user}/>)
  } else if (session && user && user.group_id) {
    return (<h6>Please leave your old group before making a new one.</h6>)
  } else if (session) {
    fetch_user(session.user_id)
    return (<h6>Loading user information...</h6>)
  } else {
    return (<h6>Sign up or login to make a group!</h6>)
  }
}

export default connect(({session, user}) => ({session, user}))(GroupNew);
