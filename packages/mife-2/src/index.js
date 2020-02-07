import * as React from "react";
import { Route } from "react-router-dom";

const OnlineUsers = ({ users }) => (
  <div>
    <b>The online users display is there on every page ...</b>
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name.first} {user.name.last}
        </li>
      ))}
    </ul>
  </div>
);

const App = () => {
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    const loadUsers = () => {
      fetch("https://randomuser.me/api?results=5")
        .then(res => res.json())
        .then(res => setUsers(res.results));
    };
    loadUsers();
    // reload every 20 seconds
    const id = setInterval(loadUsers, 20 * 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <Route path="/" render={() => <OnlineUsers users={users} />} />
    </>
  );
};

export default App;

if (typeof document !== 'undefined' && document.currentScript) {
  document.currentScript.App = App;
}
