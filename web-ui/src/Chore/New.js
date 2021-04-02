import { Alert, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { connect } from 'react-redux';


function UserNew({session}) {
    const [chore, setChore] = useState({
        name: "",
        description: "",
        rotation: 0,
        frequency: 0,
        group: "",
        responsible: []
    });

    let responsible_options = null;
    function regenResponsibleOptions() {
        // TODO
    }

    let group_options = session.user.groups.map((grp) => {
        return (
            <option>{grp.name}</option>
        );
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
        if(field === "group") {
            regenResponsibleOptions();
        }
    }
    // TODO: selects

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
                              onChange={(ev) => update("description", ev)}
                              value={chore.description}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Rotation</Form.Label>
                <Form.Control type="number"
                              onChange={(ev) => update("rotation", ev)}
                              value={chore.rotation}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Frequency</Form.Label>
                <Form.Control type="number"
                              onChange={(ev) => update("frequency", ev)}
                              value={chore.frequency}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Group</Form.Label>
                <Form.Control as="select"
                              onChange={(ev) => update("group", ev)}
                              value={chore.group}>
                    {group_options}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Responsible</Form.Label>
                <Form.Control as="select"
                              onChange={(ev) => update("responsible", ev)}
                              value={chore.responsible} multiple>
                    {responsible_options}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Save
            </Button>
        </Form>
    );
}


export default connect(({session}) => ({session}))(UserNew);
