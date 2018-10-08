import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import OfficerHistories from "./OfficerHistories";
import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import { changeInput, containsText } from "../../../testHelpers";
import OfficerHistoryNote from "./OfficerHistoryNote";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import editReferralLetter from "../thunks/editReferralLetter";
jest.mock("../../../shared/components/RichTextEditor/RichTextEditor");
jest.mock("../thunks/getReferralLetter", () => () => ({ type: "" }));
jest.mock("../thunks/editReferralLetter", () =>
  jest.fn(() => () => ({
    type: "MOCK_EDIT_REFERRAL_LETTER_THUNK"
  }))
);

describe("OfficerHistories page", function() {
  let wrapper, store, caseId;
  beforeEach(() => {
    caseId = "4";
    const referralLetterDetails = {
      id: caseId,
      caseId: caseId,
      referralLetterOfficers: [
        { fullName: "Officer 1", id: 0, caseOfficerId: 10 },
        { fullName: "Officer 2", id: 1, caseOfficerId: 11 },
        { fullName: "Officer 3", id: 2, caseOfficerId: 12 }
      ]
    };

    store = createConfiguredStore();
    store.dispatch(getReferralLetterSuccess(referralLetterDetails));

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerHistories match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("it renders a tab header for each officer", () => {
    containsText(wrapper, "[data-test='tab-10']", "Officer 1");
    containsText(wrapper, "[data-test='tab-11']", "Officer 2");
    containsText(wrapper, "[data-test='tab-12']", "Officer 3");
  });

  test("it renders a tab content for the default selected officer", () => {
    containsText(wrapper, "[data-test='tab-content-10']", "Officer 1");
    expect(
      wrapper.find("[data-test='tab-content-10']").get(0).props.style
    ).toHaveProperty("display", "block");
    expect(
      wrapper.find("[data-test='tab-content-11']").get(0).props.style
    ).toHaveProperty("display", "none");
    expect(
      wrapper.find("[data-test='tab-content-12']").get(0).props.style
    ).toHaveProperty("display", "none");
  });

  test("it renders a tab content for the selected officer", () => {
    wrapper
      .find("[data-test='tab-11']")
      .first()
      .simulate("click");
    containsText(wrapper, "[data-test='tab-content-11']", "Officer 2");
    expect(
      wrapper.find("[data-test='tab-content-11']").get(0).props.style
    ).toHaveProperty("display", "block");
    expect(
      wrapper.find("[data-test='tab-content-10']").get(0).props.style
    ).toHaveProperty("display", "none");
    expect(
      wrapper.find("[data-test='tab-content-12']").get(0).props.style
    ).toHaveProperty("display", "none");
  });

  test("it calculates the number of total historical allegations entered", () => {
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalHighAllegations']",
      "1"
    );
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalMedAllegations']",
      "2"
    );
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalLowAllegations']",
      "3"
    );
    containsText(
      wrapper,
      `[data-test='officers-10-total-historical-allegations']`,
      "6 total allegations"
    );
  });

  test("it ignores invalid values when calculating the number of total historical allegations entered", () => {
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalHighAllegations']",
      "abc"
    );
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalMedAllegations']",
      " "
    );
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalLowAllegations']",
      2
    );
    containsText(
      wrapper,
      `[data-test='officers-10-total-historical-allegations']`,
      "2 total allegations"
    );
  });

  test("it should display message when no officers", () => {
    const referralLetterDetailsWithoutOfficers = {
      id: caseId,
      caseId: caseId,
      referralLetterOfficers: []
    };
    store.dispatch(
      getReferralLetterSuccess(referralLetterDetailsWithoutOfficers)
    );
    wrapper.update();
    containsText(
      wrapper,
      `[data-test='no-officers-message']`,
      "There are no officers on this case"
    );
  });

  test("it should add a note when click add note button", () => {
    const addNoteButton = wrapper
      .find('[data-test="addOfficerHistoryNoteButton"]')
      .first();
    addNoteButton.simulate("click");
    expect(wrapper.find(OfficerHistoryNote).length).toEqual(1);
  });

  test("it should remove a note when click add note button", () => {
    const addNoteButton = wrapper
      .find('[data-test="addOfficerHistoryNoteButton"]')
      .first();
    addNoteButton.simulate("click");
    addNoteButton.simulate("click");
    addNoteButton.simulate("click");

    const notesFields = wrapper.find(OfficerHistoryNote);
    expect(notesFields.length).toEqual(3);
    changeInput(
      notesFields.first(),
      '[data-test="note-pib-case-number"]',
      "first note"
    );
    changeInput(
      notesFields.at(1),
      '[data-test="note-pib-case-number"]',
      "second note"
    );
    changeInput(
      notesFields.at(2),
      '[data-test="note-pib-case-number"]',
      "third note"
    );

    const indexOfSecondNote = 1;
    const openDialogButton = wrapper
      .find(
        `[data-test="note-${indexOfSecondNote}-openRemoveOfficerHistoryNoteButton"]`
      )
      .first();
    openDialogButton.simulate("click");
    const removeNoteButton = wrapper
      .find('[data-test="removeOfficerHistoryNoteButton"]')
      .first();
    removeNoteButton.simulate("click");

    const updatedNotesFields = wrapper.find(OfficerHistoryNote);
    expect(updatedNotesFields.length).toEqual(2);
    const firstNotePIBField = updatedNotesFields
      .first()
      .find('[data-test="note-pib-case-number"]');
    const secondNotePIBField = updatedNotesFields
      .at(1)
      .find('[data-test="note-pib-case-number"]');
    expect(firstNotePIBField.props().value).toEqual("first note");
    expect(secondNotePIBField.props().value).toEqual("third note");
  });

  test("it dispatches edit to referral letter when click back to review button when values valid", () => {
    editReferralLetter.mockClear();
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalHighAllegations']",
      "9"
    );
    const backButton = wrapper.find('[data-test="back-button"]').first();
    backButton.simulate("click");
    const expectedFormValues = {
      referralLetterOfficers: [
        {
          fullName: "Officer 1",
          id: 0,
          caseOfficerId: 10,
          numHistoricalHighAllegations: "9"
        },
        { fullName: "Officer 2", id: 1, caseOfficerId: 11 },
        { fullName: "Officer 3", id: 2, caseOfficerId: 12 }
      ]
    };
    expect(editReferralLetter).toHaveBeenCalledWith(
      caseId,
      expectedFormValues,
      `/cases/${caseId}/letter/review`
    );
  });

  test("it does not dispatch edit to referral letter when click back to review button when values not valid", () => {
    editReferralLetter.mockClear();
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalHighAllegations']",
      "abc"
    );
    const backButton = wrapper.find('[data-test="back-button"]').first();
    backButton.simulate("click");
    expect(editReferralLetter).not.toHaveBeenCalled();
  });

  test("it dispatches edit to referral letter when click save and return to cases button when values valid", () => {
    editReferralLetter.mockClear();
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalHighAllegations']",
      "9"
    );
    const backButton = wrapper
      .find('[data-test="save-and-return-to-case-link"]')
      .first();
    backButton.simulate("click");
    const expectedFormValues = {
      referralLetterOfficers: [
        {
          fullName: "Officer 1",
          id: 0,
          caseOfficerId: 10,
          numHistoricalHighAllegations: "9"
        },
        { fullName: "Officer 2", id: 1, caseOfficerId: 11 },
        { fullName: "Officer 3", id: 2, caseOfficerId: 12 }
      ]
    };
    expect(editReferralLetter).toHaveBeenCalledWith(
      caseId,
      expectedFormValues,
      `/cases/${caseId}`
    );
  });

  test("it does not dispatch edit to referral letter when click save and return to cases button when values not valid", () => {
    editReferralLetter.mockClear();
    changeInput(
      wrapper,
      "[name='referralLetterOfficers[0].numHistoricalHighAllegations']",
      "abc"
    );
    const backButton = wrapper
      .find('[data-test="save-and-return-to-case-link"]')
      .first();
    backButton.simulate("click");
    expect(editReferralLetter).not.toHaveBeenCalled();
  });
});
