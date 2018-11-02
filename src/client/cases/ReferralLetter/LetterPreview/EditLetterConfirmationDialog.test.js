import createConfiguredStore from "../../../createConfiguredStore";
import {
  closeEditLetterConfirmationDialog,
  openEditLetterConfirmationDialog
} from "../../../actionCreators/letterActionCreators";
import { mount } from "enzyme/build";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import EditLetterConfirmationDialog from "./EditLetterConfirmationDialog";
import editReferralLetterAddresses from "../thunks/editReferralLetterAddresses";

describe("Edit Confirmation Dialog", () => {
  let store, dispatchSpy, wrapper;

  const caseId = 123;

  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(openEditLetterConfirmationDialog());

    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <EditLetterConfirmationDialog />
        </Router>
      </Provider>
    );
  });

  test("close the dialog when cancel is clicked", () => {
    dispatchSpy.mockClear();
    const button = wrapper.find("[data-test='cancelButton']").first();
    button.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      closeEditLetterConfirmationDialog()
    );
  });

  // test('open edit letter page when edit letter is clicked', () => {
  //   dispatchSpy.mockClear();
  //   const editLetterButton = wrapper.find("[data-test='editLetterButton']").first();
  //   editLetterButton.simulate("click");
  //
  //   const expectedFormValues = {
  //     sender: "bob",
  //     recipient: "jane",
  //     transcribedBy: "transcriber"
  //   };
  //
  //   expect(dispatchSpy).toHaveBeenCalledWith(
  //     editReferralLetterAddresses(
  //       caseId,
  //       expectedFormValues,
  //       `/cases/${caseId}/letter/edit-letter`
  //     )
  //   );
  // });
});
