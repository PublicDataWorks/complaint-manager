import { TextFieldWithUserMention } from "./TextFieldWithUserMention";
import createConfiguredStore from "../../../../createConfiguredStore";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import React from "react";
import { wait } from "@testing-library/dom";
import { Field, reduxForm } from "redux-form";

describe("TextFieldWithUserMention", () => {
  const userList = ["Syd Botz", "Veronica Blackwell", "Wanchen Yao"];

  function renderTextFieldWithUserMention() {
    const store = createConfiguredStore();
    const TestForm = reduxForm({ form: "testTextFieldWithUserMentionForm" })(
      () => {
        return (
          <Field
            name="notes"
            label="Notes"
            component={TextFieldWithUserMention}
            inputProps={{
              "data-testid": "notesInput"
            }}
            InputLabelProps={{
              shrink: true
            }}
            multiline
            rowsMax={8}
            placeholder="Enter any notes about this action"
            fullWidth
          />
        );
      }
    );
    const wrapper = render(
      <Provider store={store}>
        <Router>
          <TestForm />
        </Router>
      </Provider>
    );

    store.dispatch(
      getFeaturesSuccess({
        notificationFeature: true
      })
    );
    return wrapper;
  }

  test("should see drop down when '@' is typed by user", async () => {
    //ARRANGE
    const {
      getByText,
      queryByText,
      getByTestId,
      debug
    } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "@" } });

    //ASSERT
    await wait(() => {
      expect(queryByText(userList[0])).toBeInTheDocument();
    });
    debug();
  });

  test("drop down should be removed if user deletes '@'", async () => {
    //ARRANGE
    const {
      getByText,
      getByTestId,
      queryByText,
      debug
    } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "@" } });

    //ASSERT
    await wait(() => {
      expect(getByText(userList[0])).toBeInTheDocument();
    });
    debug();

    //ACT
    fireEvent.change(textField, { target: { value: "" } });

    //ASSERT
    await wait(() => {
      expect(queryByText(userList[0])).not.toBeInTheDocument();
    });
    debug();
  });

  test("if user chooses an option, the option chosen should be displayed after the '@' sign", async () => {
    //ARRANGE
    const { getByText, getByTestId, debug } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "@" } });

    //ARRANGE
    const user1 = getByText("Syd Botz");
    fireEvent.click(user1);

    //ASSERT
    await wait(() => {
      expect(textField.value).toContain("@Syd Botz");
    });
    debug();
  });

  test("should see correct options in drop down when drop down occurs", async () => {
    //ARRANGE
    const { getByText, getByTestId, debug } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "@" } });

    //ASSERT
    await wait(() => {
      expect(getByText(userList[0])).toBeInTheDocument();
      expect(getByText(userList[1])).toBeInTheDocument();
      expect(getByText(userList[2])).toBeInTheDocument();
    });
    debug();
  });

  test("should see '@' and the following text if user chooses option in dropdown in bold", () => {});

  test("if user deletes a character after selecting an option, dropdown should reoccur and the text along with '@' should no longer be in bold", () => {});
});
