import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import MergeTagDialog from "./MergeTagDialog";
import createConfiguredStore from "../../createConfiguredStore";
import { GET_TAGS_SUCCEEDED } from "../../../sharedUtilities/constants";
import "@testing-library/jest-dom";

let mockPatch = jest.fn();
jest.mock("axios", () => ({
  patch: (url, body) => mockPatch(url, body)
}));

let mockGetTagsWithCount = jest.fn();
jest.mock("./thunks/getTagsWithCount", () => () => mockGetTagsWithCount);

describe("MergeTagDialog", () => {
  let closeDialog = jest.fn();
  let store = createConfiguredStore();
  beforeEach(() => {
    jest.useFakeTimers();

    render(
      <Provider store={store}>
        <Router>
          <MergeTagDialog
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            form="MergeTagForm2"
            closeDialog={closeDialog}
          />
        </Router>
      </Provider>
    );

    store.dispatch({
      type: GET_TAGS_SUCCEEDED,
      tags: [{ id: 1, name: "Tofu" }]
    });
  });

  test("should render a dropdown with the existing tags", () => {
    expect(screen.getByTestId("select-merge-tag-dropdown")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("select-merge-tag-dropdown"), {
      target: { value: "Tof" }
    });
    expect(screen.getByText("Tofu")).toBeInTheDocument();
  });

  test("should disable submit button until a tag is chosen", () => {
    expect(screen.getByTestId("mergeTagSubmitButton").disabled).toBeTrue();
    fireEvent.change(screen.getByTestId("select-merge-tag-dropdown"), {
      target: { value: "Tof" }
    });
    userEvent.click(screen.getByText("Tofu"));
    expect(screen.getByTestId("mergeTagSubmitButton").disabled).toBeFalse();
  });

  test("should make axios call when save button is clicked and call getTagsWithCount and dialog closed on success", async () => {
    let promise = Promise.resolve();
    mockPatch.mockReturnValue(promise);
    userEvent.type(screen.getByTestId("select-merge-tag-dropdown"), "Tof");
    userEvent.click(screen.getByText("Tofu"));
    userEvent.click(screen.getByTestId("mergeTagSubmitButton"));
    expect(mockPatch).toHaveBeenCalledWith("api/tags/2", { mergeTagId: 1 });
    await promise;
    expect(mockGetTagsWithCount).toBeCalledTimes(1);
    expect(closeDialog).toBeCalledTimes(1);
  });
});
