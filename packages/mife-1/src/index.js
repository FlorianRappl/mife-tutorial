import * as React from "react";
import { Route, Link } from "react-router-dom";

const Home = () => <div>You are on the home page!</div>;

const Profile = () => <div>You are on your profile page!</div>;

const App = () => (
  <>
    <Link className="menu-link" to="/">
      Home
    </Link>
    <Link className="menu-link" to="/profile">
      Profile
    </Link>
    <Route path="/" exact component={Home} />
    <Route path="/profile" exact component={Profile} />
  </>
);

export default App;

if (typeof document !== 'undefined' && document.currentScript) {
  document.currentScript.App = App;
}
