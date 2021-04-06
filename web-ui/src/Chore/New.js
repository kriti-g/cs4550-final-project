import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { create_chore, fetch_user } from '../api';
import store from "../store";


// create the base, unassigned chore first.
function ChoreNewForm({session, user}) {
    const [chore, setChore] = useState({
        name: "",
        desc: "",
        rotation: 0,
        frequency: 0,
        group_id: user.group_id,
    });
    let history = useHistory();


    function onSubmit(event){
        event.preventDefault();
        let ch = Object.assign({}, chore);
        ch["group_id"] = user.group_id;
        setChore(ch);
        console.log("chore", chore)
        create_chore(chore).then((rsp) => {
          console.log("rsp", rsp)
          if (rsp.error) {
            // if receiving an error, display it.
            store.dispatch({type: "error/set", data: rsp.error});
          } else {
            history.push("/group");
          }
        })
    }

    function update(field, event) {
        let ch = Object.assign({}, chore);
        let val = event.target.value;
        ch[field] = val;
        setChore(ch);
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text"
                              onChange={(ev) => update("name", ev)}
                              value={chore.name}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text_input"
                              onChange={(ev) => update("desc", ev)}
                              value={chore.desc}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Rotation</Form.Label>
                <Form.Control type="number"
                              onChange={(ev) => update("rotation", ev)}
                              value={chore.rotation}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Frequency (in days)</Form.Label>
                <Form.Control type="number"
                              onChange={(ev) => update("frequency", ev)}
                              value={chore.frequency}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Save
            </Button>
        </Form>
    );
}

// access control
function ChoreNew({session, user}) {
  if (session && user && user.group_id) {
    return (<ChoreNewForm session={session} user={user}/>)
  } else if (session && user) {
    return (<h6>Join or make a group to start making chores!</h6>)
  } else if (session) {
    fetch_user(session.user_id)
    return (<h6>Loading group information...</h6>)
  } else {
    return (<h6>Sign up or login to start making chores!</h6>)
  }
}

export default connect(({session, user}) => ({session, user}))(ChoreNew);
