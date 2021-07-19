import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import TagTableRow from "./TagTableRow";
import createConfiguredStore from "../../createConfiguredStore";

describe("TagTableRow", () => {
  test("should render a cell with the name and a cell with the count", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <TagTableRow classes={{}} tag={{ name: "Mr. Tag", count: 32342 }} />
        </Router>
      </Provider>
    );

    let cells = screen.getAllByRole("cell");
    expect(cells[0].textContent).toEqual("Mr. Tag");
    expect(cells[1].textContent).toEqual("32342");
  });
});
