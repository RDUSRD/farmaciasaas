import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavBar } from "./components/Navbar";
import routes from "./config/routes";

function AppUI() {
  return (
    <React.Fragment>
      <Router>
        <NavBar />
        <div className="content">
          <Switch>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                component={route.component}
              />
            ))}
          </Switch>
        </div>
      </Router>
    </React.Fragment>
  );
}

export { AppUI };
