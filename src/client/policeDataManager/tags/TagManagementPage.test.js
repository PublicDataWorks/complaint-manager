import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import TagManagementPage from "./TagManagementPage";
import createConfiguredStore from "../../createConfiguredStore";

describe("TagManagementPage", () => {
  beforeEach(() => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <TagManagementPage />
        </Router>
      </Provider>
    );
  });

  test("should have title Tag Management", () => {
    expect(screen.getByTestId("pageTitle").textContent).toEqual(
      "Tag Management"
    );
  });

  test("should have the appropriate table headers", () => {
    expect(screen.getByText("TAG NAME")).toBeInTheDocument;
    expect(screen.getByText("ASSOCIATED COMPLAINTS")).toBeInTheDocument;
  });

  test("should show the appropriate number of rows", () => {
    // TODO send rows as props once that's setup
    expect(screen.queryAllByRole("row")).toHaveLength(4); // 1 header row, three body rows
  });
});
