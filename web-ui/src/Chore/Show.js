import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import { fetch_chore, fetch_group } from "../api";

function ShowOneChore({ chore, session }) {
  return (
    <Row>
      <Col>
        <ul>
          <li>
            <strong>Name:</strong>
            {chore.name}
          </li>
          <li>
            <strong>Description:</strong>
            {chore.desc}
          </li>
          <li>
            <strong>Rotation:</strong>
            {chore.rotation}
          </li>
          <li>
            <strong>Frequency:</strong>
            {chore.frequency}
          </li>
          <li>
            <strong>Responsible:</strong>
            <ul>
              {chore.responsibilities.map((rsp) => {
                return <li key={rsp.id}>{rsp.user.name}</li>;
              })}
            </ul>
          </li>
        </ul>
      </Col>
    </Row>
  );
}

function ShowChore({ chore, group, session }) {
  function userExistsInGroup(u_id, group_users) {
    let ret = false;
    group_users.forEach((user) => {
      if (user.id == u_id) {
        ret = true;
      }
    });
    return ret;
  }
  let match = useRouteMatch();
  let id = match.params.id;

  if (!chore || (chore && chore.id != id)) {
    fetch_chore(id);
  }
  if (chore && (!group || group.id != chore.group_id)) {
    fetch_group(chore.group_id);
  }
  if (chore && group) {
    if (chore.id == id && userExistsInGroup(session.user_id, group.users)) {
      return <ShowOneChore chore={chore} session={session} />;
    } else {
      return <h6>You don't have access to this chore</h6>;
    }
  } else {
    return <div>fetching</div>;
  }
}

export default connect(({ chore, group, session }) => ({
  chore,
  group,
  session,
}))(ShowChore); // TODO
