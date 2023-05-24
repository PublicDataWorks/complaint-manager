import React from "react";
import { render } from "@testing-library/react";
import React from "react";
import PublicDataDashboard from "./PublicDataDashboard";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

it("should have no a11y errors caught by jest-axe", async () => {
  const { container } = render(
    <Provider store={store}>
      <Router>
        <PublicDataDashboard />
      </Router>
    </Provider>
  );
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
