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
  const userList = [
    { label: "Syd Botz", value: "some@some.com" },
    { label: "Veronica Blackwell", value: "some@some.com" },
    { label: "Wanchen Yao", value: "some@some.com" }
  ];

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
            users={userList}
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

  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document
    }
  });

  test("should see drop down when '@' is typed by user as the first character", async () => {
    //ARRANGE
    const { queryByText, getByTestId } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "@" } });

    //ASSERT
    await wait(() => {
      expect(queryByText(userList[0].label)).toBeInTheDocument();
    });
  });

  test("should see drop down when '@' is typed by user as not the first character", async () => {
    //ARRANGE
    const { queryByText, getByTestId } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "blah blah blah NOW @" } });

    //ASSERT
    await wait(() => {
      expect(queryByText(userList[0].label)).toBeInTheDocument();
    });
  });

  test("drop down should be removed if user deletes '@'", async () => {
    //ARRANGE
    const { getByTestId, queryByText } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "@" } });

    //ASSERT
    await wait(() => {
      expect(queryByText(userList[0].label)).toBeInTheDocument();
    });

    //ACT
    fireEvent.change(textField, { target: { value: "" } });

    //ASSERT
    await wait(() => {
      expect(queryByText(userList[0].label)).not.toBeInTheDocument();
    });
  });

  test("if user chooses an option by clicking, the option chosen should be displayed after the '@' sign", async () => {
    //ARRANGE
    const { getByText, getByTestId } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "@" } });

    //ARRANGE
    const user1 = getByText(userList[0].label);
    fireEvent.click(user1);

    //ASSERT
    await wait(() => {
      expect(textField.value).toContain("@" + userList[0].label);
    });
  });

  // test("if user chooses an option by pressing enter, the option chosen should be displayed after the '@' sign", async () => {
  //   //ARRANGE
  //   const { getByText, getByTestId } = renderTextFieldWithUserMention();
  //   const textField = getByTestId("notesInput");
  //   //ACT
  //   fireEvent.change(textField, { target: { value: "@" } });
  //
  //   //ARRANGE
  //   const user1 = getByText(userList[0].label);
  //
  //   const dropdown = getByTestId("user-dropdown");
  //   console.log(dropdown.children);
  //   fireEvent.keyDown(user1,{ key: 'Enter', code: 13 });
  //
  //   //ASSERT
  //   await wait(() => {
  //     expect(textField.value).toContain("@"+userList[0].label);
  //   });
  // });

  test("should see correct options in drop down when drop down occurs filter dropdown choices when user starts typing aft '@' symbol", async () => {
    //ARRANGE
    const { queryByText, getByTestId } = renderTextFieldWithUserMention();
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: "@" } });

    //ASSERT
    await wait(() => {
      expect(queryByText(userList[0].label)).toBeInTheDocument();
      expect(queryByText(userList[1].label)).toBeInTheDocument();
      expect(queryByText(userList[2].label)).toBeInTheDocument();
    });

    //ACT
    fireEvent.change(textField, { target: { value: "@v" } });

    //ASSERT
    await wait(() => {
      expect(queryByText(userList[0].label)).not.toBeInTheDocument();
      expect(queryByText(userList[1].label)).toBeInTheDocument();
      expect(queryByText(userList[2].label)).not.toBeInTheDocument();
    });
  });

  // test("should see '@' and the following text if user chooses option in dropdown in bold", () => {});
  //
  // test("if user deletes a character after selecting an option, dropdown should reoccur and the text along with '@' should no longer be in bold", () => {});
});
