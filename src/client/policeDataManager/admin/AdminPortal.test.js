import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AdminPortal from "./AdminPortal";
import createConfiguredStore from "../../createConfiguredStore";

describe("AdminPortal", () => {
  test("should display the signatures card", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <AdminPortal />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Signatures")).toBeInTheDocument;
  });
});
