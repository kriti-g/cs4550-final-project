import './App.scss';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import AppNav from './Nav';
import Home from './Home';
import UserList from './User/List';
import UserNew from './User/New';
import ShowUser from './User/Show';
//import ChoreList from './Chore/List';
import ChoreNew from './Chore/New';
import ShowChore from './Chore/Show';
//import GroupList from './Group/List';
import GroupNew from './Group/New';
import ShowGroup from './Group/Show';

function App() {
  return (
    <Container>
      <AppNav/>
      <Switch>
        <Route path="/" component={Home} exact/>
        <Route path="/users" component={UserList} exact/>
        <Route path="/users/new" component={UserNew} exact/>
        <Route path="/users/:id" component={ShowUser} exact/>
        <Route path="/chores/new" component={ChoreNew} exact/>
        <Route path="/chores/:id" component={ShowChore} exact/>
        <Route path="/groups/new" component={GroupNew} exact/>
        <Route path="/group" component={ShowGroup} exact/>
      </Switch>
    </Container>
  );
}

export default App;
