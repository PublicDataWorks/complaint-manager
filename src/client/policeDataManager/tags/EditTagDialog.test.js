import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import EditTagDialog from "./EditTagDialog";
import createConfiguredStore from "../../createConfiguredStore";
import { GET_TAGS_SUCCEEDED } from "../../../sharedUtilities/constants";
import "@testing-library/jest-dom";

let mockPut = jest.fn();
jest.mock("axios", () => ({
  put: (url, body) => mockPut(url, body)
}));

let mockGetTagsWithCount = jest.fn();
jest.mock("./thunks/getTagsWithCount", () => () => mockGetTagsWithCount);

describe("EditTagDialog", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("should render a textbox with an already populated tag name", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            form="EditTagForm2"
          />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId("editTagCancelButton")).toBeInTheDocument();
    expect(screen.getByTestId("editTagTextBox").value).toEqual("Mr. Tag");
  });

  test("should render an error after submit on an already existing tag", () => {
    let store = createConfiguredStore();
    store.dispatch({
      type: GET_TAGS_SUCCEEDED,
      tags: [{ name: "Tofu", id: 3, count: 1 }]
    });
    render(
      <Provider store={store}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            form="EditTagForm2"
          />
        </Router>
      </Provider>
    );
    let saveButton = screen.getByTestId("saveTagButton");
    expect(saveButton).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("editTagTextBox"), {
      target: { value: "Tofu" }
    });
    fireEvent.submit(screen.getByRole("form"));
    screen.getByText("The tag name you entered already exists");
  });

  test("should disable edit button by default", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            form="EditTagForm2"
          />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId("saveTagButton").disabled).toEqual(true);
  });

  test("should disable edit button when tag already exist", () => {
    let store = createConfiguredStore();
    store.dispatch({
      type: GET_TAGS_SUCCEEDED,
      tags: [{ name: "Tofu", id: 3, count: 1 }]
    });
    render(
      <Provider store={store}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            form="EditTagForm2"
          />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByTestId("editTagTextBox"), {
      target: { value: "Tofu" }
    });
    expect(screen.getByTestId("saveTagButton").disabled).toEqual(true);

    fireEvent.change(screen.getByTestId("editTagTextBox"), {
      target: { value: "ofu" }
    });
    expect(screen.getByTestId("saveTagButton").disabled).toEqual(false);
  });

  test("should renable edit button when tag isn't blank or doesn't exist", () => {
    let store = createConfiguredStore();
    store.dispatch({
      type: GET_TAGS_SUCCEEDED,
      tags: [{ name: "Tofu", id: 3, count: 1 }]
    });
    render(
      <Provider store={store}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            form="EditTagForm2"
          />
        </Router>
      </Provider>
    );

    const saveTagButton = screen.getByTestId("saveTagButton");
    const editTagTextBox = screen.getByTestId("editTagTextBox");
    expect(saveTagButton.disabled).toEqual(true);

    userEvent.type(editTagTextBox, "slkjdf");
    expect(saveTagButton.disabled).toEqual(false);

    fireEvent.change(editTagTextBox, { target: { value: "Tofu" } });
    expect(saveTagButton.disabled).toEqual(true);

    fireEvent.change(editTagTextBox, { target: { value: "" } });
    expect(saveTagButton.disabled).toEqual(true);

    userEvent.type(editTagTextBox, "hello");
    expect(saveTagButton.disabled).toEqual(false);

    fireEvent.change(editTagTextBox, { target: { value: "      " } });
    expect(saveTagButton.disabled).toEqual(true);
  });

  test("should execute exit function when exit button is clicked", () => {
    let exitFunction = jest.fn();
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            exit={exitFunction}
            form="EditTagForm2"
          />
        </Router>
      </Provider>
    );

    userEvent.click(screen.getByTestId("editTagCancelButton"));
    expect(exitFunction).toBeCalledTimes(1);
  });

  test("should make axios call when save button is clicked and call getTagsWithCount and dialog closed on success", async () => {
    let exitFunction = jest.fn();
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            form="EditTagForm2"
            exit={exitFunction}
          />
        </Router>
      </Provider>
    );

    let promise = Promise.resolve();
    mockPut.mockReturnValue(promise);
    userEvent.type(screen.getByTestId("editTagTextBox"), "hello");
    userEvent.click(screen.getByTestId("saveTagButton"));
    expect(mockPut).toHaveBeenCalledWith("api/tags/2", {
      id: 2,
      name: "Mr. Taghello"
    });
    await promise;
    expect(mockGetTagsWithCount).toBeCalledTimes(1);
    expect(exitFunction).toBeCalledTimes(1);
  });
});
