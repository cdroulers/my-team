import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";
import { Provider as UnstatedProvider } from "unstated";
import { MemoryRouter } from "react-router-dom";

import App from "../index";

const renderer = new ShallowRenderer();

describe("<App />", () => {
  it("should render and match the snapshot", () => {
    renderer.render(
      <MemoryRouter>
        <UnstatedProvider>
          <App />
        </UnstatedProvider>
      </MemoryRouter>,
    );
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
