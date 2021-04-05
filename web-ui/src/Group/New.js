import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { connect } from 'react-redux';

import { create_group, fetch_user } from '../api';

function GroupNewForm({session, user}) {
    const [group, setGroup] = useState({
        name: "",
        members: []
    });
    let user_options = null; 

    function onSubmit(event){
        event.preventDefault();
        create_group(group);
    }

    function update(field, event) {
        let grp = Object.assign({}, group);
        grp[field] = event.target.value;
        setGroup(grp);
    }

    // TODO: select
    return (
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text"
                              onChange={(ev) => update("name", ev)}
                              value={group.name} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Memebers</Form.Label>
                <Form.Control type="select"
                              onChange={(ev) => update("members", ev)}
                    value={group.members} multiple>
                    {user_options}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Save
            </Button>
        </Form>
    );
}



function GroupNew({session, user}){
  if (user) {
    return (<GroupNewForm session={session} user={user}/>)
  } else if (session) {
    fetch_user(session.user_id)
    return (<h6>Loading user information...</h6>)
  } else {
    return (<h6>Sign up or login to start making chores!</h6>)
  }
}

export default connect(({session, user}) => ({session, user}))(GroupNew);
