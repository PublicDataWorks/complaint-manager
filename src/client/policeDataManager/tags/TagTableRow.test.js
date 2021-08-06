import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import TagTableRow from "./TagTableRow";
import createConfiguredStore from "../../createConfiguredStore";
import { before } from "lodash";

describe("TagTableRow", () => {
  test("should render a cell with the name and a cell with the count", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <table>
            <tbody>
              <TagTableRow
                classes={{}}
                tag={{ name: "Mr. Tag", count: 32342 }}
              />
            </tbody>
          </table>
        </Router>
      </Provider>
    );

    let cells = screen.getAllByRole("cell");
    expect(cells[0].textContent).toEqual("Mr. Tag");
    expect(cells[1].textContent).toEqual("32342");
    expect(cells[2].textContent).toEqual("Edit");
  });

  describe("Edit dialog", () => {
    beforeEach(() => {
      render(
        <Provider store={createConfiguredStore()}>
          <Router>
            <table>
              <tbody>
                <TagTableRow
                  classes={{}}
                  tag={{ name: "Monsieur Tag", count: 32342 }}
                />
              </tbody>
            </table>
          </Router>
        </Provider>
      );
    });

    test("should launch a dialog with the tag name populated when edit button clicked", () => {
      userEvent.click(screen.getByTestId("editTagButton"));
      expect(screen.getByTestId("editTagTextBox").value).toEqual(
        "Monsieur Tag"
      );
    });

    test("should close dialog when cancel button is clicked", async () => {
      userEvent.click(screen.getByTestId("editTagButton"));
      userEvent.click(screen.getByTestId("editTagCancelButton"));
      expect(screen.queryByTestId("editTagButton")).not.toBeInTheDocument;
    });
  });
});
