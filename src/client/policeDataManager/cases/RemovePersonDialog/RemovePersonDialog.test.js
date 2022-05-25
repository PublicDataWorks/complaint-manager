import RemoveCivilianDialog from "./RemovePersonDialog";
import React from "react";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import createConfiguredStore from "../../../createConfiguredStore";
import {
  closeRemovePersonDialog,
  openRemovePersonDialog
} from "../../actionCreators/casesActionCreators";
import removePerson from "../thunks/removePerson";

jest.mock("../thunks/removePerson", () => () => ({
  type: "MOCK_THUNK"
}));

describe("removePersonDialog", () => {
  let dispatchSpy, wrapper, caseId, civilianDetails;
  beforeEach(() => {
    const store = createConfiguredStore();

    civilianDetails = {
      id: 123,
      caseId: 456,
      firstName: "John",
      middleInitial: "D",
      lastName: "Doe",
      suffix: "III",
      fullName: "John D. Doe III"
    };

    store.dispatch(
      openRemovePersonDialog(civilianDetails, "civilians", "NOPD")
    );
    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <RemoveCivilianDialog />
      </Provider>
    );
  });

  test("should close dialog when cancel button is clicked", () => {
    const cancelButton = wrapper.find('[data-testid="cancelButton"]').first();
    cancelButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(closeRemovePersonDialog());
  });

  test("should dispatch thunk when remove button is clicked", () => {
    const removeButton = wrapper.find('[data-testid="removeButton"]').first();
    removeButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      removePerson(civilianDetails.id, civilianDetails.caseId)
    );
  });

  test("should contain civilian full name", () => {
    const dialogText = wrapper
      .find('[data-testid="warningText"]')
      .first()
      .text();
    expect(dialogText).toContain(civilianDetails.fullName);
  });
});
