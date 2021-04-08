import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

import Flatpickr from "react-flatpickr";
import "../index.css";
import "flatpickr/dist/themes/material_green.css";
import { create_bulk_responsibilites } from "../api";
import store from "../store";
import { channel_signal } from "../socket"

// TODO: CHECK ALL COMPLETIONS. should be synced with highest num of all responsibilities.
function ResponsibilityModal(props) {
  let { group_id, chore, users } = props;

  const [respState, setRespState] = useState({
    completions: 0,
    deadline: "", //  if deadline exists then ok.
    group_id: group_id,
    chore_id: null,
    user_ids: [],
    chore_loaded: false,
  });

  useEffect(() => {
    if (
      chore &&
      (chore.id !== respState.chore_id || respState.chore_loaded === false)
    ) {
      console.log("USEEFFECT", chore);
      let new_user_ids = [];
      chore.responsibilities.forEach((resp) => {
        new_user_ids.push(resp.user.id);
      });
      setRespState({
        ...respState,
        chore_loaded: true,
        user_ids: new_user_ids,
        chore_id: chore.id,
        completions: 0, // UPDATE THIS after you get a list of responsibilties
        deadline:
          chore.responsibilities.length === 0
            ? ""
            : chore.responsibilities[0].deadline,
      });

      checkBoxForResponsibleUsers(chore.responsibilities);
    }
    // weird, but this is necessary.
    if (chore && respState.chore_loaded === false) {
      checkBoxForResponsibleUsers(chore.responsibilities);
    }
  }, [chore, respState]);

  //   function

  function save() {
    console.log("RESPSTATE", respState);

    let responsibility = {
      deadline: Array.isArray(respState.deadline)
        ? respState.deadline[0]
        : respState.deadline,
      group_id: respState.group_id,
      chore_id: respState.chore_id,
      user_ids: respState.user_ids,
      completions: respState.completions,
    };

    create_bulk_responsibilites(responsibility).then((rsp) => {
      console.log("MODAL-SAVE", rsp);
      if (rsp.error) {
        // if receiving an error, display it.
        store.dispatch({ type: "error/set", data: rsp.error });
      } else {
        setRespState({ chore_loaded: false });
        channel_signal();
        //fetch_group(respState.group_id);
        // refetch_group(respState.group_id);
        props.onHide();
        window.location.reload(false);

        // history.push("/group");
      }
    });
  }
  // add or remove user_id to respState.user_ids depending on if they already exist or not.
  function selectUsers(user_id) {
    console.log("#", respState.user_ids);
    let idx = respState.user_ids.indexOf(user_id);
    let new_user_ids = respState.user_ids;

    // check if user_id exists in respState
    if (idx === -1) {
      // add
      new_user_ids.push(user_id);
    } else {
      // remove
      new_user_ids.splice(idx, 1);
    }
    setRespState({ ...respState, user_ids: new_user_ids });
  }

  function checkBoxForResponsibleUsers(responsibilities) {
    responsibilities.forEach((resp) => {
      let checkboxId = "check_" + resp.user.id;
      document.getElementById(checkboxId).checked = true;
    });
  }

  function userIsResponsible(user_id) {
    chore.responsibilities.forEach((resp) => {
      if (resp.user.id === user_id) {
        return true;
      }
    });
    return false;
  }

  function updateDate(field, ev) {
    let u1 = Object.assign({}, respState);
    u1[field] = ev;
    setRespState(u1);
  }

  let userSelection = users.map((u) => {
    if (chore && userIsResponsible(u.id)) {
      return (
        <li key={u.id}>
          <Form.Check
            onClick={() => selectUsers(u.id)}
            id={"check_" + u.id}
            type="checkbox"
            label={u.name}
            value
            checked
          />
        </li>
      );
    } else {
      return (
        <li key={u.id}>
          <Form.Check
            onClick={() => selectUsers(u.id)}
            id={"check_" + u.id}
            type="checkbox"
            label={u.name}
            value
          />
        </li>
      );
    }
  });

  return (
    <Modal
      animation={false}
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {chore ? "Assign Responsibility: " + chore.name : "Fetching..."}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Select Users</h4>
        <ul className="noBullets">{userSelection}</ul>

        <Form.Group>
          <Form.Label>Deadline</Form.Label>
          <Flatpickr
            data-enable-time
            className="c-date-picker form-control"
            value={respState.deadline}
            onChange={(ev) => updateDate("deadline", ev)}
            options={{ dateFormat: "Y-m-d H:i" }}
            placeholder="Click to set deadline"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-success" onClick={() => save()}>
          Save
        </Button>

        <Button className="btn-danger" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

//   export default connect(({ group, user, session }) => ({
//     group,
//     user,
//     session,
//   }))(ShowGroup);

export default ResponsibilityModal;
