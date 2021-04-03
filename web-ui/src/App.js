import './App.scss';
import { Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap';
import Nav from './Nav';
import Home from './Home';
import UserList from './User/List';
import UserNew from './User/New';
import ShowUser from './User/Show';
import ChoreList from './Chore/List';
import ChoreNew from './Chore/New';
import ShowChore from './Chore/Show';
import GroupNew from './Group/New';
import ShowGroup from './Group/Show';

function App() {
  return (
    <Container>
      <Nav/>
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/users" component={UserList}/>
        <Route path="/users/new" component={UserNew}/>
        <Route path="/users/:id" component={ShowUser}/>
        <Route path="/chores" component={ChoreList}/>
        <Route path="/chores/new" component={ChoreNew}/>
        <Route path="/chores/:id" component={ShowChore}/>
        <Route path="/groups/new" component={GroupNew}/>
        <Route path="/groups/:id" component={ShowGroup}/>
      </Switch>
    </Container>
  );
}

export default App;
