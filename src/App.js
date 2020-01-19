import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";



function App() {
  const [status, setStatus] = useState(false);
  const changeStatus = {
    signin(cb) {
      setStatus(true);
      setTimeout(cb, 100);
    },
    signout(cb) {
      setStatus(false)
      setTimeout(cb, 100);
    }
  }
  return (
    <Router>
      <div>
        <AuthInfo status={status} changeStatus={changeStatus} />

        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/protected">Protected Page</Link></li>
        </ul>

        <Switch>
          <Route path="/login">
            <SignInPage status={status} changeStatus={changeStatus} />
          </Route>
          <Route path="/public">
            <PublicPage />
          </Route>
          <PrivateRoute path="/protected" status={status}>
            <ProtectedPage status={status} />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  )
}

function AuthInfo(props) {
  let { status, changeStatus } = props;
  let history = useHistory();

  return status ? (
    <p>
      Welcome!
    <button onClick={() => {
        changeStatus.signout(history.push("/"));
      }}
      >
        Sign out
    </button>
    </p>
  ) : (
      <p>You are not signed in.</p>
    );
}


function PublicPage() {
  return <p>public</p>;
}

function ProtectedPage() {
  return <p>protected</p>;
}

function PrivateRoute({ children, status, ...rest }) {
  console.log({ ...rest })
  return (
    <Route
      {...rest}
      render={({ location }) =>
        status ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}


function SignInPage(props) {
  let { status, changeStatus } = props;
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  console.log(location);

  let logIn = () => {
    changeStatus.signin(history.replace(from.pathname));
  }

  return status ? (
    <p>
      You have signed in
    </p>
  ) : (
      <div>
        <p>You must sign in to view the page at {from.pathname}</p>
        <div>
          <input type="text" />
        </div>
        <div>
          <input type="password" />
        </div>
        <button onClick={logIn}>
          Sign In
      </button>
      </div>
    );
}

export default App;