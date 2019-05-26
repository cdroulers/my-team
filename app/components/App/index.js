/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "components/HomePage/Loadable";
import NotFoundPage from "components/NotFoundPage/Loadable";

import GlobalStyle from "../../global-styles";

function Test() {
  return <div>hai, this is a test page. lkjsdfjklsdf</div>;
}

export default function App() {
  return (
    <div>
      TEST
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/test" component={Test} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </div>
  );
}
