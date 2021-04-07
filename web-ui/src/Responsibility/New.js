import { Alert, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { connect } from 'react-redux';

// create the base, unassigned chore first.
function ChoreNew({session}) {
    const [chore, setChore] = useState({
        name: "",
        desc: "",
        rotation: 0,
        frequency: 0,
        group_id: 0,
    });

    function onSubmit(event){
        event.preventDefault();
        // TODO
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
                <Form.Label>Frequency (Hours)</Form.Label>
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


export default connect(({session}) => ({session}))(ChoreNew);
