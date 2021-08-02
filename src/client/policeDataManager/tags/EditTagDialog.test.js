import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import EditTagDialog from "./EditTagDialog";
import createConfiguredStore from "../../createConfiguredStore";
import { GET_TAGS_SUCCEEDED } from "../../../sharedUtilities/constants";

describe("EditTagDialog", () => {
  test("should render a textbox with an already populated tag name", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
          />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId("editTagCancelButton")).toBeInTheDocument;
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
          />
        </Router>
      </Provider>
    );
    let saveButton = screen.getByTestId("saveTagButton");
    expect(saveButton).toBeInTheDocument;
    fireEvent.change(screen.getByTestId("editTagTextBox"), {
      target: { value: "Tofu" }
    });
    fireEvent.submit(screen.getByRole("form"));
    screen.getByText("The tag name you entered already exists");

    fireEvent.change(screen.getByTestId("editTagTextBox"), {
      target: { value: "tofu" }
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
          />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByTestId("editTagTextBox"), {
      target: { value: "Tofu" }
    });
    expect(screen.getByTestId("saveTagButton").disabled).toEqual(true);

    fireEvent.change(screen.getByTestId("editTagTextBox"), {
      target: { value: "tofu" }
    });
    expect(screen.getByTestId("saveTagButton").disabled).toEqual(true);
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

  test("should execute cancel function when cancel button is clicked", () => {
    let cancelFunction = jest.fn();
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
            cancel={cancelFunction}
          />
        </Router>
      </Provider>
    );

    userEvent.click(screen.getByTestId("editTagCancelButton"));
    expect(cancelFunction).toBeCalledTimes(1);
  });
});
