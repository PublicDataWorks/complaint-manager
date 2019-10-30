import React from "react";
import { mount } from "enzyme";
import OfficerAllegations from "./OfficerAllegations";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import {
  ALLEGATION_SEVERITY,
  EDIT_ALLEGATION_FORM_CLOSED
} from "../../../sharedUtilities/constants";
import editOfficerAllegation from "../cases/thunks/editOfficerAllegation";
import { changeInput } from "../../testHelpers";
import { openRemoveOfficerAllegationDialog } from "../actionCreators/allegationsActionCreators";
import { getCaseDetailsSuccess } from "../actionCreators/casesActionCreators";

//mock thunk to return action that closes the allegation form
jest.mock("../cases/thunks/editOfficerAllegation", () => allegation => ({
  type: "EDIT_ALLEGATION_FORM_CLOSED",
  allegationId: allegation.id
}));

describe("OfficerAllegations", function() {
  let dispatchSpy, officerAllegations, wrapper, allegation1, allegation2;
  beforeEach(() => {
    const caseId = 12;
    const caseOfficerId = 7;
    officerAllegations = [
      {
        allegation: {
          id: 3,
          paragraph: "paragraph1",
          rule: "A specific rule",
          directive: "directive1"
        },
        caseOfficerId,
        id: 1,
        details: "detailsss1",
        severity: ALLEGATION_SEVERITY.MEDIUM
      },
      {
        allegation: {
          id: 4,
          paragraph: "paragraph2",
          rule: "a very very specific rule",
          directive: "directive2"
        },
        caseOfficerId,
        id: 2,
        details: "detailsss2",
        severity: ALLEGATION_SEVERITY.HIGH
      }
    ];

    const store = createConfiguredStore();
    store.dispatch(
      getCaseDetailsSuccess({ accusedOfficers: [{ id: caseOfficerId }] })
    );
    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <OfficerAllegations
          officerAllegations={officerAllegations}
          caseId={caseId}
        />
      </Provider>
    );

    allegation1 = wrapper.find('[data-test="officerAllegation0"]').first();
    allegation2 = wrapper.find('[data-test="officerAllegation1"]').first();
  });

  test("should render officer allegations", () => {
    expect(allegation1.text()).toContain("A Specific Rule");
    expect(allegation2.text()).toContain("A Very Very Specific Rule");
  });

  test("should render edit allegation form after click", () => {
    const editButton1 = allegation1
      .find('[data-test="editAllegationButton"]')
      .first();
    editButton1.simulate("click");

    wrapper.update();

    const updatedEditButton1 = wrapper
      .find('[data-test="officerAllegation0"]')
      .first()
      .find('[data-test="editAllegationButton"]')
      .first();
    expect(updatedEditButton1.exists()).toEqual(false);

    const cancelButton = wrapper
      .find('[data-test="editAllegationCancel"]')
      .first();
    expect(cancelButton.exists()).toEqual(true);

    const submitButton = wrapper
      .find('[data-test="editAllegationSubmit"]')
      .first();
    expect(submitButton.exists()).toEqual(true);
  });

  test("expand icon should be disabled in edit mode", () => {
    const expandIcon = wrapper.find('[data-test="expandIcon"]').first();

    const editButton1 = allegation1
      .find('[data-test="editAllegationButton"]')
      .first();
    editButton1.simulate("click");

    wrapper.update();

    const updatedExpandIcon = wrapper.find('[data-test="expandIcon"]').first();

    expect(expandIcon.props().disabled).toBeFalsy();
    expect(updatedExpandIcon.props().disabled).toBeTruthy();
  });

  test("should not render allegation form after submit", () => {
    const editButton1 = allegation1
      .find('[data-test="editAllegationButton"]')
      .first();
    editButton1.simulate("click");

    wrapper.update();

    const submitButton = wrapper
      .find('[data-test="editAllegationSubmit"]')
      .first();
    expect(submitButton.exists()).toEqual(true);

    changeInput(wrapper, '[data-test="allegationInput"]', "different values");

    submitButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      editOfficerAllegation({
        id: officerAllegations[0].id,
        details: officerAllegations[0].details
      })
    );
    wrapper.update();

    const updatedEditButton1 = wrapper
      .find('[data-test="officerAllegation0"]')
      .first()
      .find('[data-test="editAllegationButton"]')
      .first();
    const saveAllegationButton = wrapper
      .find('[data-test="editAllegationSubmit"]')
      .first();

    expect(updatedEditButton1.exists()).toEqual(true);
    expect(saveAllegationButton.exists()).toEqual(false);
  });

  test("should open remove allegation dialog when remove button clicked", () => {
    const removeButton = allegation1
      .find('[data-test="removeAllegationButton"]')
      .last();
    removeButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openRemoveOfficerAllegationDialog(officerAllegations[0])
    );
  });
});
