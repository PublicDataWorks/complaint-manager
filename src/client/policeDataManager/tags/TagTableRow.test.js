import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { TagTableRow } from "./TagTableRow";
import createConfiguredStore from "../../createConfiguredStore";

let mockDelete = jest.fn();
jest.mock("axios", () => ({
  delete: url => mockDelete(url)
}));

let getTagsWithCount = jest.fn();
describe("TagTableRow", () => {
  beforeEach(() => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <table>
            <tbody>
              <TagTableRow
                classes={{}}
                tag={{ id: 332, name: "Monsieur Tag", count: "32342" }}
                getTagsWithCount={getTagsWithCount}
              />
            </tbody>
          </table>
        </Router>
      </Provider>
    );
  });

  test("should render a cell with the name and a cell with the count", () => {
    let cells = screen.getAllByRole("cell");
    expect(cells[0].textContent).toEqual("Monsieur Tag");
    expect(cells[1].textContent).toEqual("32342");
    expect(cells[2].textContent).toEqual("Rename");
    expect(cells[3].textContent).toEqual("Merge");
    expect(cells[4].textContent).toEqual("Remove");
  });

  describe("Edit dialog", () => {
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

  describe("Remove dialog", () => {
    beforeEach(() => {
      userEvent.click(screen.getByTestId("removeTagButton"));
    });

    test("should launch a remove dialog when remove button clicked", () => {
      expect(screen.getByTestId("dialog-confirm-button")).toBeInTheDocument;
    });

    test("should close remove dialog when cancel button is clicked", () => {
      expect(screen.queryByTestId("dialog-cancel-button")).toBeInTheDocument;
      userEvent.click(screen.getByTestId("dialog-cancel-button"));
      expect(screen.queryByTestId("dialog-cancel-button")).toBeNull();
    });

    test("should call removeTag handler, then get all tags and close dialog when confirm button is clicked", () => {
      let promise = Promise.resolve();
      mockDelete.mockReturnValue(promise);
      userEvent.click(screen.getByTestId("dialog-confirm-button"));
      expect(mockDelete).toHaveBeenCalledWith("api/tags/332");
      promise.then(() => {
        expect(getTagsWithCount).toHaveBeenCalled();
        expect(screen.queryByTestId("dialog-cancel-button")).toBeNull();
      });
    });
  });

  describe("Merge dialog", () => {
    test("should launch a dialog with a tag select dropdown", () => {
      userEvent.click(screen.getByTestId("mergeTagButton"));
      expect(screen.getByTestId("select-merge-tag-dropdown")).toBeInTheDocument;
    });

    test("should close dialog when cancel button is clicked", async () => {
      userEvent.click(screen.getByTestId("mergeTagButton"));
      userEvent.click(screen.getByTestId("mergeTagCancelButton"));
      expect(screen.queryByTestId("mergeTagCancelButton")).not
        .toBeInTheDocument;
    });
  });
});
