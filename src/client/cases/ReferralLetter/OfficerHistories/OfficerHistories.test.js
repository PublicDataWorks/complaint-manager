import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import OfficerHistories from "./OfficerHistories";
import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import { changeInput, containsText } from "../../../testHelpers";
import OfficerHistoryNote from "./OfficerHistoryNote";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import editOfficerHistory from "../thunks/editOfficerHistory";
import { push } from "connected-react-router";
import getReferralLetterEditStatus from "../thunks/getReferralLetterEditStatus";
import getReferralLetterData from "../thunks/getReferralLetterData";
import getMinimumCaseDetails from "../../thunks/getMinimumCaseDetails";

jest.mock("../../../shared/components/RichTextEditor/RichTextEditor");
jest.mock("../thunks/getReferralLetterData", () => caseId => ({
  type: "getReferralLetterData",
  caseId
}));
jest.mock("../thunks/getReferralLetterEditStatus", () => caseId => ({
  type: "getReferralLetterEditStatus",
  caseId
}));
jest.mock("../../thunks/getMinimumCaseDetails", () => caseId => ({
  type: "getMinimumCaseDetails",
  caseId
}));
jest.mock("../thunks/editOfficerHistory", () =>
  jest.fn(() => () => ({
    type: "MOCK_EDIT_OFFICER_HISTORY_THUNK"
  }))
);

describe("OfficerHistories page", function() {
  let store, wrapper, caseId, dispatchSpy;

  beforeEach(() => {
    caseId = "12";
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerHistories match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  describe("officers on the case", function() {
    beforeEach(() => {
      const referralLetterDetails = {
        id: caseId,
        caseId: caseId,
        letterOfficers: [
          { fullName: "Officer 1", id: 0, caseOfficerId: 10 },
          { fullName: "Officer 2", id: 1, caseOfficerId: 11 },
          { fullName: "Officer 3", id: 2, caseOfficerId: 12 }
        ]
      };

      store.dispatch(getReferralLetterSuccess(referralLetterDetails));
      wrapper.update();
    });

    test("loads referral letter data on mount", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(getReferralLetterData(caseId));
    });

    test("loads letter type on mount so message can be displayed", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        getReferralLetterEditStatus(caseId)
      );
    });

    test("loads minimum case details on mount so case reference can be displayed", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(getMinimumCaseDetails(caseId));
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
        "[name='letterOfficers[0].numHistoricalHighAllegations']",
        "1"
      );
      changeInput(
        wrapper,
        "[name='letterOfficers[0].numHistoricalMedAllegations']",
        "2"
      );
      changeInput(
        wrapper,
        "[name='letterOfficers[0].numHistoricalLowAllegations']",
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
        "[name='letterOfficers[0].numHistoricalHighAllegations']",
        "abc"
      );
      changeInput(
        wrapper,
        "[name='letterOfficers[0].numHistoricalMedAllegations']",
        " "
      );
      changeInput(
        wrapper,
        "[name='letterOfficers[0].numHistoricalLowAllegations']",
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
        letterOfficers: []
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
      editOfficerHistory.mockClear();
      changeInput(
        wrapper,
        "[name='letterOfficers[0].numHistoricalHighAllegations']",
        "9"
      );
      const backButton = wrapper.find('[data-test="back-button"]').first();
      backButton.simulate("click");
      const expectedFormValues = {
        letterOfficers: [
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
      expect(editOfficerHistory).toHaveBeenCalledWith(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/review`
      );
    });

    test("allegation fields don't accept bad input", () => {
      editOfficerHistory.mockClear();
      changeInput(
        wrapper,
        "[name='letterOfficers[0].numHistoricalHighAllegations']",
        "abc"
      );
      expect(
        wrapper
          .find("[name='letterOfficers[0].numHistoricalHighAllegations']")
          .last()
          .prop("value")
      ).toBe("");
    });

    test("it dispatches edit to referral letter when click back to cases button when values valid", () => {
      editOfficerHistory.mockClear();
      changeInput(
        wrapper,
        "[name='letterOfficers[0].numHistoricalHighAllegations']",
        "9"
      );
      const backButton = wrapper
        .find('[data-test="save-and-return-to-case-link"]')
        .first();
      backButton.simulate("click");
      const expectedFormValues = {
        letterOfficers: [
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
      expect(editOfficerHistory).toHaveBeenCalledWith(
        caseId,
        expectedFormValues,
        `/cases/${caseId}`
      );
    });

    test("it dispatches edit to referral letter when click next when values valid", () => {
      editOfficerHistory.mockClear();
      changeInput(
        wrapper,
        "[name='letterOfficers[0].numHistoricalHighAllegations']",
        "9"
      );
      const backButton = wrapper.find('[data-test="next-button"]').first();
      backButton.simulate("click");
      const expectedFormValues = {
        letterOfficers: [
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
      expect(editOfficerHistory).toHaveBeenCalledWith(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/iapro-corrections`
      );
    });

    describe("Saves and Redirects when click Stepper Buttons", function() {
      let expectedFormValues;
      beforeEach(function() {
        editOfficerHistory.mockClear();
        changeInput(
          wrapper,
          "[name='letterOfficers[0].numHistoricalHighAllegations']",
          "9"
        );
        expectedFormValues = {
          letterOfficers: [
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
      });

      test("it dispatches edit and redirects to review letter when click review case details stepper button", () => {
        const reviewCaseDetailsButton = wrapper
          .find('[data-test="step-button-Review Case Details"]')
          .first();
        reviewCaseDetailsButton.simulate("click");
        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/review`
        );
      });

      test("it dispatches edit and redirects to officer history when click officer history stepper button", () => {
        const reviewCaseDetailsButton = wrapper
          .find('[data-test="step-button-Officer Complaint Histories"]')
          .first();
        reviewCaseDetailsButton.simulate("click");
        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/officer-history`
        );
      });

      test("it dispatches edit and redirects to iapro corrections when click iapro corrections stepper button", () => {
        const reviewCaseDetailsButton = wrapper
          .find('[data-test="step-button-IAPro Corrections"]')
          .first();
        reviewCaseDetailsButton.simulate("click");
        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/iapro-corrections`
        );
      });

      test("it dispatches edit and redirects to recommended actions when click recommended actions stepper button", () => {
        const reviewCaseDetailsButton = wrapper
          .find('[data-test="step-button-Recommended Actions"]')
          .first();
        reviewCaseDetailsButton.simulate("click");
        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/recommended-actions`
        );
      });

      test("it dispatches edit and redirects to preview when click preview stepper button", () => {
        const reviewCaseDetailsButton = wrapper
          .find('[data-test="step-button-Preview"]')
          .first();
        reviewCaseDetailsButton.simulate("click");
        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/letter-preview`
        );
      });
    });
  });

  describe("no officers on the case", function() {
    let dispatchSpy;
    beforeEach(() => {
      editOfficerHistory.mockClear();
      const letterId = "15";
      const referralLetterDetails = {
        id: letterId,
        caseId: caseId,
        letterOfficers: []
      };

      store.dispatch(getReferralLetterSuccess(referralLetterDetails));
      dispatchSpy = jest.spyOn(store, "dispatch");

      wrapper = mount(
        <Provider store={store}>
          <Router>
            <OfficerHistories match={{ params: { id: caseId } }} />
          </Router>
        </Provider>
      );
    });

    test("it does not submit the form but does redirect when no officers on the case when click back button", () => {
      const backButton = wrapper.find('[data-test="back-button"]').first();
      backButton.simulate("click");
      expect(editOfficerHistory).not.toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        push(`/cases/${caseId}/letter/review`)
      );
    });

    test("it does not submit the form but does redirect when no officers on the case when click back to case button", () => {
      const backButton = wrapper
        .find('[data-test="save-and-return-to-case-link"]')
        .first();
      backButton.simulate("click");
      expect(editOfficerHistory).not.toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(push(`/cases/${caseId}`));
    });
  });
});
