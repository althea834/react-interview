import React from "react";
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
  return (
    <Router>
      <div>
        <AuthInfo />

        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/protected">Protected Page</Link></li>
        </ul>

        <Switch>
          <Route path="/login">
            <SignInPage />
          </Route>
          <Route path="/public">
            <PublicPage />
          </Route>
          <PrivateRoute path="/protected">
            <ProtectedPage />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  )
}

const simpleAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    simpleAuth.isAuthenticated = true;
    setTimeout(cb, 50);
  },
  signout(cb) {
    simpleAuth.isAuthenticated = false;
    setTimeout(cb, 50);
  }
}

function AuthInfo() {
  let history = useHistory();

  return simpleAuth.isAuthenticated ? (
    <p>
      Welcome!
    <button onClick={() => {
        simpleAuth.signout(() => history.push("/"));
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

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        simpleAuth.isAuthenticated ? (
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


function SignInPage() {
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  let logIn = () => {
    simpleAuth.authenticate(() => history.replace(from));
  }

  return (
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
