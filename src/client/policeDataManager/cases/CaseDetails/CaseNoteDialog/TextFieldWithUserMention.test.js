import { TextFieldWithUserMention } from "./TextFieldWithUserMention";
import createConfiguredStore from "../../../../createConfiguredStore";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import React from "react";
import { waitFor } from "@testing-library/dom";
import { Field, reduxForm } from "redux-form";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import MutationObserver from "@sheerun/mutationobserver-shim";
window.MutationObserver = MutationObserver;

describe("TextFieldWithUserMention", () => {
  const userList = [
    { label: "Syd Botz", value: "some@some.com" },
    { label: "Veronica Blackwell", value: "some@some.com" },
    { label: "Wanchen Yao", value: "some@some.com" }
  ];

  function renderTextFieldWithUserMention(
    filterValue = "",
    cursorPosition = 1
  ) {
    const store = createConfiguredStore();
    const TestForm = reduxForm({ form: "testTextFieldWithUserMentionForm" })(
      () => {
        const filterAfterMention = jest
          .fn()
          .mockReturnValue(
            createFilterOptions({ stringify: option => option.label })(
              userList,
              { inputValue: filterValue }
            )
          );

        const displayUserDropdown = value => {
          const indexOfFirstMention = value.indexOf("@");
          return value.includes("@") && cursorPosition > indexOfFirstMention;
        };

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
            maxRows={8}
            placeholder="Enter any notes about this action"
            fullWidth
            users={userList}
            filterAfterMention={filterAfterMention}
            onSetMentionedUsers={jest.fn()}
            displayUserDropdown={displayUserDropdown}
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
    await waitFor(() => {
      expect(queryByText(userList[0].label)).toBeInTheDocument();
    });
  });

  test("should see drop down when '@' is typed by user as not the first character", async () => {
    //ARRANGE
    const caseNoteText = "blah blah blah NOW @";
    const { queryByText, getByTestId } = renderTextFieldWithUserMention(
      "",
      caseNoteText.length
    );
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, { target: { value: caseNoteText } });

    //ASSERT
    await waitFor(() => {
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
    await waitFor(() => {
      expect(queryByText(userList[0].label)).toBeInTheDocument();
    });

    //ACT
    fireEvent.change(textField, { target: { value: "" } });

    //ASSERT
    await waitFor(() => {
      expect(queryByText(userList[0].label)).not.toBeInTheDocument();
    });
  });

  test("drop down should be removed if user deletes first '@Mention' at the beginning of case note and case note contains a later mention", async () => {
    //ARRANGE
    const { getByTestId, queryByText } = renderTextFieldWithUserMention("", 0);
    const textField = getByTestId("notesInput");

    //ACT
    fireEvent.change(textField, {
      target: { value: "@Veronica Blackwell please notify @Syd Botz" }
    });

    //ACT
    fireEvent.change(textField, {
      target: { value: " please notify @Syd Botz" }
    });

    //ASSERT
    await waitFor(() => {
      expect(queryByText(userList[1].label)).not.toBeInTheDocument();
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
    await waitFor(() => {
      expect(textField.value).toContain("@" + userList[0].label);
    });
  });

  // test("if user chooses an option by pressing enter, the option chosen should be displayed after the '@' sign", async () => {
  //   // Selecting on Enter (a JSDOM limitation?): https://github.com/testing-library/react-testing-library/issues/269
  //   //ARRANGE
  //   const { getByTestId } = renderTextFieldWithUserMention();
  //   const textField = getByTestId("notesInput");
  //   //ACT
  //   fireEvent.change(textField, { target: { value: "@" } });
  //
  //   //ARRANGE
  //   textField.focus();
  //   fireEvent.keyDown(textField, {
  //     key: "Enter",
  //     charCode: "13",
  //     keyCode: "13",
  //     bubbles: true
  //   });
  //
  //   //ASSERT
  //   await wait(() => {
  //     expect(textField.value).toContain("@" + userList[0].label);
  //   });
  // });

  test("if user deletes a character after selecting an option, dropdown should reoccur and the text along with '@'", async () => {
    //ARRANGE
    const caseNoteText = "@Syd Bot";
    const { getByTestId, queryByText } = renderTextFieldWithUserMention(
      "Syd Bot",
      caseNoteText.length
    );
    const textField = getByTestId("notesInput");

    //ACT (remove last char)
    fireEvent.change(textField, { target: { value: caseNoteText } });

    //ASSERT (dropdown to appear again)
    await waitFor(() => {
      expect(queryByText(userList[0].label)).toBeInTheDocument();
      expect(queryByText(userList[1].label)).not.toBeInTheDocument();
      expect(queryByText(userList[2].label)).not.toBeInTheDocument();
    });
  });
});
