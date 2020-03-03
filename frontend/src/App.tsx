import React from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from "react-router-dom";
import { StaticContext, useLocation } from "react-router";
import './scss/index.scss';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from './utils/cookieHandling';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import { UserContextConsumer } from './utils/UserContext';

function App() {
  // Toastify global configuration
  toast.configure({
    position: "bottom-center",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    autoClose: 2000
  });

  // Get token saved in cookie
  const token = getCookie("notes-app_token");

  const routes: {
    path: string;
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> |
    { (props: RouteComponentProps<any, StaticContext, any>): React.Component };
    title?: string;
    adminRestriction?: boolean;
  }[] = [
    {
      path: "/",
      component: Home,
      title: "Home"
    }
  ];

  // Routes to use when not logged in
  const notLoggedIn = (
    <Switch>
      <Route path="/login" exact component={Login} />

      <Redirect to="/login" />
    </Switch>
  )

  // Routes to use if logged in
  const loggedIn = (
    <div className="content">
      <Switch>
        { routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact
            render={(props: RouteComponentProps) => (
              <route.component {...props} />
            )}
          />
        ))}
      </Switch>
    </div>
  )

  return (
    <UserContextConsumer>
      {value => (
        value?.isLoggedIn || token ? loggedIn : notLoggedIn
      )}
    </UserContextConsumer>
  );
}

export default App;
