import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import createConfiguredStore from "../../createConfiguredStore";
import InmateDetails from "./InmateDetails";

describe("Inmate details", () => {
  beforeEach(() => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <InmateDetails match={{ params: { id: "1" } }} />
        </Router>
      </Provider>
    );
  });

  test("should render Selected Manually Add Person in Custody", () => {
    expect(screen.getByText("Selected Manually Add Person in Custody"));
  });

  test.todo(
    "should successfully submit and redirect when first name, middle initial, and last name are entered"
  );
});
