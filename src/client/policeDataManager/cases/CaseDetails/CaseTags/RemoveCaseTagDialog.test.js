import createConfiguredStore from "../../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import RemoveCaseTagDialog from "./RemoveCaseTagDialog";
import removeCaseTag from "../../thunks/removeCaseTag";

jest.mock("../../thunks/removeCaseTag", () => (caseId, caseTagId) => ({
  type: "MOCK_ACTION",
  caseId,
  caseTagId
}));

describe("RemoveCaseTagDialog", () => {
  let store, closeDialog, caseTag;

  beforeEach(() => {
    store = createConfiguredStore();
    closeDialog = jest.fn();

    caseTag = {
      id: 1,
      caseId: 1,
      tagId: 1,
      tag: {
        id: 1,
        name: "Penguin"
      }
    };
  });

  test("should call removeCaseTag thunk with correct values", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseTagDialog
          dialogOpen={true}
          closeDialog={jest.fn()}
          caseTagId={caseTag.tagId}
          caseId={caseTag.caseId}
        />
      </Provider>
    );

    const removeCaseTagButton = wrapper
      .find('[data-testid="removeCaseTag"]')
      .first();
    removeCaseTagButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      removeCaseTag(caseTag.caseId, caseTag.id)
    );
  });

  test("should close dialog when cancel button clicked", () => {
    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseTagDialog
          dialogOpen={true}
          closeDialog={closeDialog}
          caseTagId={caseTag.tagId}
          caseId={caseTag.caseId}
        />
      </Provider>
    );

    const cancelButton = wrapper.find('[data-testid="cancelButton"]').first();
    cancelButton.simulate("click");

    expect(closeDialog).toHaveBeenCalled();
  });

  test("should close dialog when return button clicked when case is archived", () => {
    const caseDetail = { isArchived: true };
    store.dispatch(getCaseDetailsSuccess(caseDetail));

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseTagDialog
          dialogOpen={true}
          closeDialog={closeDialog}
          caseTagId={caseTag.tagId}
          caseId={caseTag.caseId}
        />
      </Provider>
    );

    const returnButton = wrapper.find('[data-testid="returnButton"]').first();
    returnButton.simulate("click");

    expect(closeDialog).toHaveBeenCalled();
  });
});
