import { Card, Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

function Home({session, user}) {
    let home = null;
    if(user) {
        let chores = user.responsibilities.map((resp) => {
            return (
                <li>
                    {resp.chore.name} - {resp.deadline}
                </li>
            );
        });
        home = (
            <ul>
                {chores}
            </ul>
        );
    } else {
        // TODO: fetch and store user based on session id
        home = (<h5>Make an account to begin coordinating your chores!</h5>);
    }
    return home;
}

export default connect(({session, user}) => ({session, user}))(Home);
