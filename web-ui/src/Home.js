import { Card, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetch_user } from './api';

function Home({session, user}) {
  let home = null;
  if(user) {
    let chores = user.responsibilities.map((resp) => {
      return (
        <li key={resp.id}>
        {resp.chore.name} due at {resp.deadline}.
        </li>
      );
    });
    
    home = (
      <>
      <h4>Your responsibilities:</h4>
      <ul>
      {chores}
      </ul>
      </>
    );
  } else if (session) {
    fetch_user(session.user_id);
    home = (<h5>Loading user details...</h5>);
  } else {
    home = (<h5>Make an account to begin coordinating your chores!</h5>);
  }
  return home;
}

export default connect(({session, user}) => ({session, user}))(Home);
