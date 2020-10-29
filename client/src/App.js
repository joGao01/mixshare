import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
  AccountSettings,
  Discover,
  Homepage,
  NotFound,
  PlaylistSearch,
} from './pages';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/account" component={AccountSettings} />
        <Route exact path="/discover" component={Discover} />
        <Route exact path="/search" component={PlaylistSearch} />
        <Route path="/404" component={NotFound} />
        <Redirect to="/404" />
      </Switch>
    </Router>
  );
}

export default App;
