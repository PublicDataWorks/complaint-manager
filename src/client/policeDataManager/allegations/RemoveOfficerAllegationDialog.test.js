import createConfiguredStore from "../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../actionCreators/casesActionCreators";
import {
  closeRemoveOfficerAllegationDialog,
  openRemoveOfficerAllegationDialog
} from "../actionCreators/allegationsActionCreators";
import React from "react";
import RemoveOfficerAllegationDialog from "./RemoveOfficerAllegationDialog";
import { Provider } from "react-redux";
import removeOfficerAllegation from "../cases/thunks/removeOfficerAllegation";
import { mount } from "enzyme";

jest.mock("../cases/thunks/removeOfficerAllegation", () => allegationId => ({
  type: "MOCK_ACTION",
  allegationId
}));

describe("remove officer allegation dialog ", () => {
  let wrapper, dispatchSpy, allegation, officerFullName;
  beforeEach(() => {
    const store = createConfiguredStore();
    allegation = {
      id: 5,
      caseOfficerId: 8,
      details: "allegation details",
      allegation: {
        rule: "rule",
        paragraph: "paragraph",
        directive: "directive"
      }
    };
    officerFullName = "Barry Symonds";
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      getCaseDetailsSuccess({
        accusedOfficers: [
          { id: allegation.caseOfficerId, fullName: officerFullName }
        ]
      })
    );
    store.dispatch(openRemoveOfficerAllegationDialog(allegation));

    wrapper = mount(
      <Provider store={store}>
        <RemoveOfficerAllegationDialog />
      </Provider>
    );
  });

  test("should include officer's full name in prompt", () => {
    const prompt = wrapper
      .find('[data-testid="removeAllegationPrompt"]')
      .last();

    expect(prompt.text()).toEqual(expect.stringContaining(officerFullName));
  });

  test("should include allegation in prompt", () => {
    const prompt = wrapper.find('[data-testid="allegationToRemove"]').last();

    expect(prompt.text()).toEqual(expect.stringContaining(allegation.details));
    expect(prompt.text()).toEqual(
      expect.stringContaining(allegation.allegation.rule)
    );
    expect(prompt.text()).toEqual(
      expect.stringContaining(allegation.allegation.paragraph)
    );
    expect(prompt.text()).toEqual(
      expect.stringContaining(allegation.allegation.directive)
    );
  });

  test("should call removeOfficerAllegation thunk with correct values", () => {
    const removeOfficerAllegationButton = wrapper
      .find('[data-testid="removeOfficerAllegationButton"]')
      .first();
    removeOfficerAllegationButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      removeOfficerAllegation(allegation.id)
    );
  });

  test("should dispatch close action when cancel is clicked", () => {
    const cancelRemoveAllegationButton = wrapper
      .find('[data-testid="cancelRemoveAllegationButton"]')
      .last();
    cancelRemoveAllegationButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      closeRemoveOfficerAllegationDialog()
    );
  });
});
