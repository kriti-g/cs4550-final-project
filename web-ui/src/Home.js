import { Card, Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

function Home({session}) {
    let home = null;
    if(session.user) {
        let chores = session.user.chores.map((chr) => {
            return (
                <li>
                    {chr.name}
                </li>
            );
        });
        home = (
            <ul>
                {chores}
            </ul>
        );
    } else {
        // TODO
    }
    return home;
}

export default connect(({session}) => ({session}))(Home);
