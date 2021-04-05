import { Alert, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { create_user, api_login } from '../api';
import pick from 'lodash/pick';
import store from "../store";


function UserNewForm() {
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

    function confirm_validator(val) {
        if(val !== user.password) {
            return "Passwords don't match";
        }
        return "";
    }

    const validators = {
        email: email_validator,
        phone: phone_validator,
        password: password_validator,
        password_confirm: confirm_validator
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
        create_user(data).then((rsp) => {
          if (rsp.error) {
            // if receiving an error, display it.
            store.dispatch({type: "error/set", data: rsp.error});
          } else {
            // store.dispatch({type: "user/set", data: data.data});
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
            let target = field + "_msg";
            if(field === "password_confirm") {
                target = "password_msg";
            }
            usr[target] = validator(val);
        }
        setUser(usr);
    }

    let email_alert = null;
    let pnumber_alert = null;
    let password_alert = null;
    if(user.email_msg !== "") {
        email_alert = (<Alert key="email_alert" variant="danger">{user.email_msg}</Alert>);
    }
    if(user.phone_number_msg !== "") {
        pnumber_alert = (<Alert key="pnumber_alert" variant="danger">{user.phone_number_msg}</Alert>);
    }
    if(user.password_msg !== ""){
        password_alert = (<Alert key="password_alert" variant="danger">{user.password_msg}</Alert>);
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
                {email_alert}
            </Form.Group>
            <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel"
                              onChange={(ev) => update("phone_number", ev)}
                              value={user.phone_number}/>
                {pnumber_alert} 
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password"
                              onChange={(ev) => update("password", ev)}
                              value={user.password}/>
                {password_alert}
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password"
                              onChange={(ev) => update("password_confirm", ev)}
                              value={user.password_confirm}/>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!submit_ready()}>
                Save
            </Button>
        </Form>
    );
}


function UserNew({session}) {
    console.log("User New")
    if(session) {
        return (<h6>Already Signed In</h6>);
    } else {
        return (<UserNewForm/>);
    }
}

function states2prop({session}) {
    return {session};
}

export default connect(states2prop)(UserNew);
