/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import "@babel/polyfill";

// Import all the third party stuff
import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import "sanitize.css/sanitize.css";
import { BrowserRouter } from "react-router-dom";
import { Provider as UnstatedProvider } from "unstated";

// Import root app
import App from "components/App";

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import "!file-loader?name=[name].[ext]!./images/favicon.ico";
import "file-loader?name=.htaccess!./.htaccess";
/* eslint-enable import/no-unresolved, import/extensions */

// Import i18n messages
import { translationMessages } from "./i18n";

const MOUNT_NODE = document.getElementById("app");

const render = messages => {
  ReactDOM.render(
    <UnstatedProvider>
      <IntlProvider locale="en" key="en" messages={messages}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </IntlProvider>
    </UnstatedProvider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(["./i18n", "components/App"], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import("intl"));
  })
    .then(() => Promise.all([import("intl/locale-data/jsonp/en.js")]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === "production") {
  require("offline-plugin/runtime").install(); // eslint-disable-line global-require
}
