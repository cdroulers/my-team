/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import HomePage from "components/HomePage/Loadable";
import MatchPage from "components/MatchPage/Loadable";
import NotFoundPage from "components/NotFoundPage/Loadable";

import GlobalStyle from "../../global-styles";

export default function App() {
  return (
    <div>
      <h1>My team manager</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/matches/:matchId" component={MatchPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </div>
  );
}
