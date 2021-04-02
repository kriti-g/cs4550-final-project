import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { connect } from 'react-redux';


function GroupNew() {
    const [group, setGroup] = useState({
        name: "",
        members: []
    });
    let user_options = null; 

    function onSubmit(event){
        event.preventDefault();
        // TODO
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


function states2prop(_states) {
    return {};
}

export default connect(states2prop)(GroupNew);
