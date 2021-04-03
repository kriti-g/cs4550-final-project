import { Alert, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { create_user, api_login } from '../api';
import pick from 'lodash/pick';
import store from "../store";


function UserNew() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        email_msg: "",
        phone_number: "",
        phone_number_msg: "",
        password: "",
        password_confirm: "",
        password_msg: ""
    });
    let history = useHistory();

    function email_validator(val) {
        // From emailregex.com
        const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(email_regex.test(val)) {
            return "";
        } else {
            return "Invalid Email";
        }
    }

    function phone_validator(val) {
        // From https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s02.html
        const phone_regex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
        if(phone_regex.test(val)) {
            return "";
        } else {
            return "Invalid phone number";
        }
    }

    function password_validator(val) {
        if(val.length < 8) {
            return "Password not long enough, must be at least 8 characters long";
        }

        if(val !== user.password_confirm) {
            return "Passwords don't match";
        }

        return "";
    }

    const validators = {
        email: email_validator,
        phone: phone_validator,
        password: password_validator,
    }

    function submit_ready() {
        return user.name !== ""
               && user.email !== ""
               && user.email_msg === ""
               && user.phone_number !== ""
               && user.phone_number_msg === ""
               && user.password === user.password_confirm
               && user.password_msg === "";
    }

    function onSubmit(event){
        event.preventDefault();
        let data = pick(user, ["name", "email", "phone_number", "password"]);
        create_user(user).then((data) => {
          if (data.error) {
            // if receiving an error, display it.
            store.dispatch({type: "error/set", data: data.error});
          } else {
            // store.dispatch({type: "user/set", data: data.data});
            // store.dispatch({type: "user_form/set", data: data.data});
            // api_login(data.data.email, user["password"]);
            history.push("/");
          }
        })
    }

    function update(field, event) {
        let usr = Object.assign({}, user);
        let val = event.target.value;
        usr[field] = val;
        let validator = validators[field];
        if(validator) {
            usr[field + "_msg"] = validator(val);
        }
        setUser(usr);
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text"
                              onChange={(ev) => update("name", ev)}
                              value={user.name}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email"
                              onChange={(ev) => update("email", ev)}
                              value={user.email}/>
                <Alert key="email_alert" variant="danger">{user.email_msg}</Alert>
            </Form.Group>
            <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel"
                              onChange={(ev) => update("phone_number", ev)}
                              value={user.phone_number}/>
                <Alert key="pnumber_alert" variant="danger">{user.phone_number_msg}</Alert>
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password"
                              onChange={(ev) => update("password", ev)}
                              value={user.password}/>
                <Alert key="password_alert" variant="danger">{user.password_msg}</Alert>
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password"
                              onChange={(ev) => update("password_confirm", ev)}
                              value={user.password_confirm}/>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={submit_ready()}>
                Save
            </Button>
        </Form>
    );
}

function states2prop(_states) {
    return {};
}

export default connect(states2prop)(UserNew);
