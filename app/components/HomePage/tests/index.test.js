import React from "react";
import { render } from "react-testing-library";
import { IntlProvider } from "react-intl";
import { Provider as UnstatedProvider } from "unstated";
import { MemoryRouter } from "react-router-dom";

import HomePage from "../index";

describe("<HomePage />", () => {
  it("should render and match the snapshot", () => {
    const {
      container: { firstChild },
    } = render(
      <MemoryRouter>
        <UnstatedProvider>
          <IntlProvider locale="en">
            <HomePage />
          </IntlProvider>
        </UnstatedProvider>
      </MemoryRouter>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
