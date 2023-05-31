import React from "react";
import { render } from "@testing-library/react";
import PublicDataDashboard from "./PublicDataDashboard";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { axe, toHaveNoViolations } from "jest-axe";
import createConfiguredStore from "../createConfiguredStore";
expect.extend(toHaveNoViolations);

it("should have no a11y errors caught by jest-axe", async () => {
  const store = createConfiguredStore();

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
