import { Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import store from "../store";

import { fetch_chore, update_bulk_responsibilites } from '../api';

function ShowOneChore({chore, session}) {
  let rem_completions = completions_left();
  let next_deadline = deadline();
  function completions_left() {
    if (chore.responsibilities.length === 0) {
      return chore.rotation
    } else {
      return chore.rotation - chore.responsibilities[0].completions
    }
  }
  function deadline() {
    if (chore.responsibilities.length === 0) {
      return "N/A"
    } else {
      return chore.responsibilities[0].deadline
    }
  }

    return (
        <Row>
            <Col>
                <h4> {chore.name} </h4>
                <p>Complete by {next_deadline}</p>
                <p>Completions left before new rotation: {rem_completions}</p>
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
  function delete_chore() {
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
        fetch_chore(chore.id)
      }
    });
  }
  let delete_button = (
    <Button
    variant="danger"
    onClick={(ev) => delete_chore()}>
    Delete
    </Button>
  )
  let edit_button = is_responsible ? (
    <Button
    variant="success"
    onClick={(ev) => mark_complete()}>
    Mark complete
    </Button>
  ) : (<></>)

  return (<>{edit_button}</>)
}

function ShowChore({chore, session}){
    let match = useRouteMatch();
    let id = match.params.id;
    if(chore && chore.id == id) {
        return (<ShowOneChore chore={chore} session={session}/>);
    } else if(session && chore === null) {
        fetch_chore(id);
        return (<h6>Loading Chore...</h6>);
    } else {
        return (<h6>You must be signed in to view this chore</h6>);
    }
}

export default connect(({ chore, session }) => ({ chore, session }))(ShowChore); // TODO
