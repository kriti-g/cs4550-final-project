import { Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import store from "../store";
import { delete_chore } from "../api"
import { useHistory } from "react-router-dom";
import {
  join_group_channel,
  channel_signal,
  check_channel,
  check_chore,
  set_chore,
  channel_signal_deletion,
  listen_for_deletions,
} from "../socket"
import { sendLoc } from '../socket.js'

import { fetch_chore, update_bulk_responsibilites } from '../api';

function ShowOneChore({chore, session}) {
  let history = useHistory();
  let rem_completions = completions_left();
  let next_deadline = deadline();
  function completions_left() {
    if (chore.rotation === 0) {
      return "Chore does not rotate."
    } else if (chore.responsibilities.length === 0) {
      return "Completions left before new rotation:" + chore.rotation
    } else {
      return "Completions left before new rotation:" + (chore.rotation - chore.responsibilities[0].completions)
    }
  }
  function deadline() {
    if (chore.responsibilities.length === 0) {
      return "N/A"
    } else {
      return chore.responsibilities[0].deadline
    }
  }

  function delete_cb(resp) {
    if (resp.chore_id === chore.id) {
      set_chore("deleted")
      history.push("/group")
      store.dispatch({ type: "chore/clear", data: {} });
    }
  }

  if (!check_channel()) {
    join_group_channel(session.user_id, chore.group_id)
  }
  if (!(check_chore() === chore.id)) {
    set_chore(chore.id)
  }
  listen_for_deletions(delete_cb);

    return (
        <Row>
            <Col>
                <h4> {chore.name} </h4>
                <p>Complete by {next_deadline}</p>
                <p>{rem_completions}</p>
                <p>Chore is repeated every {chore.frequency} hour(s).</p>
                <p>{chore.desc}</p>
                <h6>Members responsible:</h6>
                <ul>
                    {chore.responsibilities.map((rsp) => {
                        return (
                            <li key={rsp.id}>
                                {rsp.user.name}
                            </li>
                        );
                    })}
                </ul>
            </Col>
            <Col>
              <ChoreControls chore={chore} session={session}/>
            </Col>
        </Row>
    );
}

function ChoreControls({chore, session}) {
  let is_responsible = chore.responsibilities.some((rsp) => {
      return rsp.user.id === session.user_id; });

  function on_delete() {
    delete_chore(chore.id).then((rsp) => {
      if (rsp.error) {
        // if receiving an error, display it.
        store.dispatch({ type: "error/set", data: rsp.error });
      } else {
        // update this chore
        channel_signal_deletion(chore.id)
      }
    });
  }

  function format_loc(loc) {
    let location = {
        chore: chore.id,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
    };
    console.log("format_loc", location)
    sendLoc(location);
  }

  function check_in() {
    if(navigator.geolocation) {
      console.log("Getting location");
        navigator.geolocation.getCurrentPosition(format_loc);
    }
    else {
      console.log("Location support not available");
    }
  }

  function mark_complete() {
    let new_completions = chore.responsibilities[0].completions + 1
    let params = Object.assign({}, chore.responsibilities[0]);
    params["chore_id"] = chore.id
    params["completions"] = new_completions
    update_bulk_responsibilites(params).then((rsp) => {
      if (rsp.error) {
        // if receiving an error, display it.
        store.dispatch({ type: "error/set", data: rsp.error });
      } else {
        // update this chore
        channel_signal()
      }
    });
  }
  let delete_button = (
    <Button
    variant="danger"
    onClick={(_ev) => on_delete()}>
    Delete
    </Button>
  )
  let check_in_button = is_responsible ? (
    <Button
    variant="primary"
    onClick={(_ev) => check_in()}>
    Check in
    </Button>
  ) : (<></>)
  let edit_button = is_responsible ? (
    <Button
    variant="success"
    onClick={(_ev) => mark_complete()}>
    Mark complete
    </Button>
  ) : (<></>)

  return (<>{delete_button}{edit_button}{check_in_button}</>)
}

function ShowChore({chore, session}){
    let match = useRouteMatch();
    let id = match.params.id;
    if(chore && chore.id === parseInt(id) && check_chore() !== "deleted") {
        return (<ShowOneChore chore={chore} session={session}/>);
    } else if (session && (chore === null || chore.id !== parseInt(id))) {
        fetch_chore(id);
        return (<h6>Loading Chore...</h6>);
    } else {
        return (<h6>You must be signed in to view this chore</h6>);
    }
}

export default connect(({ chore, session }) => ({ chore, session }))(ShowChore); // TODO
