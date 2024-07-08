import { render, fireEvent, screen, getByTestId } from "@testing-library/react";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import OfficerHistories from "./OfficerHistories";
import React from "react";
// import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import { changeInput, containsText } from "../../../../testHelpers";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import editOfficerHistory from "../thunks/editOfficerHistory";
import { push } from "connected-react-router";
import getReferralLetterEditStatus from "../thunks/getReferralLetterEditStatus";
import getReferralLetterData from "../thunks/getReferralLetterData";
import getCaseDetails from "../../thunks/getCaseDetails";
import { getOfficerHistoryOptionsRadioButtonValuesSuccess } from "../../../actionCreators/officerHistoryOptionsActionCreator";
import { createMemoryHistory } from "history";
import { reduxForm } from "redux-form";

jest.mock("../thunks/getReferralLetterData", () => caseId => ({
  type: "getReferralLetterData",
  caseId
}));
jest.mock("../thunks/getReferralLetterEditStatus", () => caseId => ({
  type: "getReferralLetterEditStatus",
  caseId
}));
jest.mock("../../thunks/getCaseDetails", () => caseId => ({
  type: "getCaseDetails",
  caseId
}));
jest.mock("../thunks/editOfficerHistory", () =>
  jest.fn(() => () => ({
    type: "MOCK_EDIT_OFFICER_HISTORY_THUNK"
  }))
);
const Wrapper = ({ children }) => {
  return children;
};
const FormWrapper = reduxForm({ form: "testForm" })(Wrapper);
describe("OfficerHistories page", function () {
  let store, caseId, dispatchSpy;

  beforeEach(() => {
    caseId = "12";
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    const officerHistoryOptions = [
      { id: 1, name: "No noteworthy officer history to include in letter" },
      { id: 2, name: "Officer is a recruit so there is no history" },
      { id: 3, name: "Officer has significant/noteworthy history" }
    ];
    store.dispatch(
      getOfficerHistoryOptionsRadioButtonValuesSuccess(officerHistoryOptions)
    );
  });

  describe("officers on the case", function () {
    let result;
    beforeEach(() => {
      const referralLetterDetails = {
        id: caseId,
        caseId: caseId,
        letterOfficers: [
          {
            fullName: "Officer 1",
            id: 0,
            caseOfficerId: 10,
            officerHistoryOptionId: "4"
          },
          {
            fullName: "Officer 2",
            id: 1,
            caseOfficerId: 11,
            officerHistoryOptionId: "4"
          },
          {
            fullName: "Officer 3",
            id: 2,
            caseOfficerId: 12,
            officerHistoryOptionId: "4"
          }
        ]
      };

      store.dispatch(getReferralLetterSuccess(referralLetterDetails));

      // wrapper = mount
      const history = createMemoryHistory();
      result = render(
        <Provider store={store}>
          <Router history={history}>
            <FormWrapper>
              <OfficerHistories match={{ params: { id: caseId } }} />
            </FormWrapper>
          </Router>
        </Provider>
      );
    });

    test("loads referral letter data on mount", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(getReferralLetterData(caseId));
    });

    test("loads letter type on mount so message can be displayed", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        getReferralLetterEditStatus(caseId)
      );
    });

    test("loads case details on mount so case reference can be displayed", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(getCaseDetails(caseId));
    });

    test("it renders a tab header for each officer", () => {
      expect(screen.getByTestId("tab-10").textContent).toEqual("Officer 1");
      expect(screen.getByTestId("tab-11").textContent).toEqual("Officer 2");
      expect(screen.getByTestId("tab-12").textContent).toEqual("Officer 3");
    });

    test("it renders a tab content for the default selected officer", () => {
      expect(
        screen.getByTestId("tab-content-10").textContent.includes("Officer 1")
      ).toBe(true);

      expect(screen.getByTestId("tab-content-10").style).toHaveProperty(
        "display",
        "block"
      );

      expect(screen.getByTestId("tab-content-11").style).toHaveProperty(
        "display",
        "none"
      );

      expect(screen.getByTestId("tab-content-12").style).toHaveProperty(
        "display",
        "none"
      );
    });

    test("it renders a tab content for the selected officer", () => {
      fireEvent.click(screen.getByTestId("tab-11"));
      expect(
        screen.getByTestId("tab-content-11").textContent.includes("Officer 2")
      ).toBe(true);

      expect(screen.getByTestId("tab-content-11").style).toHaveProperty(
        "display",
        "block"
      );

      expect(screen.getByTestId("tab-content-10").style).toHaveProperty(
        "display",
        "none"
      );

      expect(screen.getByTestId("tab-content-12").style).toHaveProperty(
        "display",
        "none"
      );
    });

    test("it calculates the number of total historical allegations entered", () => {
      fireEvent.change(
        result.baseElement.querySelector(
          "[name='letterOfficers[0].numHistoricalHighAllegations']"
        ),
        { target: { value: "1" } }
      );
      fireEvent.change(
        result.baseElement.querySelector(
          "[name='letterOfficers[0].numHistoricalMedAllegations']"
        ),
        { target: { value: "2" } }
      );
      fireEvent.change(
        result.baseElement.querySelector(
          "[name='letterOfficers[0].numHistoricalLowAllegations']"
        ),
        { target: { value: "3" } }
      );
      expect(
        screen.getAllByTestId("total-allegations-count")[0].textContent
      ).toEqual("6");
    });

    test("it ignores invalid values when calculating the number of total historical allegations entered", () => {
      fireEvent.change(
        result.baseElement.querySelector(
          "[name='letterOfficers[0].numHistoricalHighAllegations']"
        ),
        { target: { value: "abc" } }
      );
      fireEvent.change(
        result.baseElement.querySelector(
          "[name='letterOfficers[0].numHistoricalMedAllegations']"
        ),
        { target: { value: " " } }
      );
      fireEvent.change(
        result.baseElement.querySelector(
          "[name='letterOfficers[0].numHistoricalLowAllegations']"
        ),
        { target: { value: "2" } }
      );
      expect(
        screen.getAllByTestId("total-allegations-count")[0].textContent
      ).toEqual("2");
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

      expect(screen.getByTestId("no-officers-message").textContent).toEqual(
        "There are no officers on this case"
      );
    });
    test("it should add a note when click add note button", async () => {
      await userEvent.click(
        screen.getAllByTestId("addOfficerHistoryNoteButton")[0]
      );
      expect(
        screen.getByTestId("note-0-openRemoveOfficerHistoryNoteButton")
      ).toBeTruthy();
    });

    test("it should remove a note when click remove note button", () => {
      const addNoteButton = screen.getAllByTestId(
        "addOfficerHistoryNoteButton"
      )[0];
      fireEvent.click(addNoteButton);
      fireEvent.click(addNoteButton);
      fireEvent.click(addNoteButton);

      let notesFields = screen.getAllByTestId("note-pib-case-number");
      expect(notesFields.length).toEqual(3);
      fireEvent.change(notesFields[0], { target: { value: "first note" } });
      fireEvent.change(notesFields[1], { target: { value: "second note" } });
      fireEvent.change(notesFields[2], { target: { value: "third note" } });

      const indexOfSecondNote = 1;
      const openDialogButton = screen.getByTestId(
        `note-${indexOfSecondNote}-openRemoveOfficerHistoryNoteButton`
      );
      fireEvent.click(openDialogButton);
      const removeNoteButton = screen.getByTestId(
        "removeOfficerHistoryNoteButton"
      );
      fireEvent.click(removeNoteButton);

      notesFields = screen.getAllByTestId("note-pib-case-number");
      expect(notesFields.length).toEqual(2);
      expect(notesFields[0].value).toEqual("first note");
      expect(notesFields[1].value).toEqual("third note");
    });

    test("it dispatches edit to referral letter when click back to review button when values valid", () => {
      editOfficerHistory.mockClear();
      fireEvent.change(screen.getAllByTestId("high-allegations")[0], {
        target: { value: "9" }
      });

      const backButton = screen.getByTestId("back-button");
      fireEvent.click(backButton);

      const expectedFormValues = {
        letterOfficers: [
          {
            fullName: "Officer 1",
            id: 0,
            caseOfficerId: 10,
            numHistoricalHighAllegations: "9",
            officerHistoryOptionId: "4"
          },
          {
            fullName: "Officer 2",
            id: 1,
            caseOfficerId: 11,
            officerHistoryOptionId: "4"
          },
          {
            fullName: "Officer 3",
            id: 2,
            caseOfficerId: 12,
            officerHistoryOptionId: "4"
          }
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
      fireEvent.change(screen.getAllByTestId("high-allegations")[0], {
        target: { value: "abc" }
      });

      expect(screen.getAllByTestId("high-allegations")[0].value).toBe("");
    });

    test("it dispatches edit to referral letter when click back to cases button when values valid", () => {
      editOfficerHistory.mockClear();
      fireEvent.change(screen.getAllByTestId("high-allegations")[0], {
        target: { value: "9" }
      });

      const backButton = screen.getByTestId("save-and-return-to-case-link");
      fireEvent.click(backButton);

      const expectedFormValues = {
        letterOfficers: [
          {
            fullName: "Officer 1",
            id: 0,
            caseOfficerId: 10,
            numHistoricalHighAllegations: "9",
            officerHistoryOptionId: "4"
          },
          {
            fullName: "Officer 2",
            id: 1,
            caseOfficerId: 11,
            officerHistoryOptionId: "4"
          },
          {
            fullName: "Officer 3",
            id: 2,
            caseOfficerId: 12,
            officerHistoryOptionId: "4"
          }
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
      fireEvent.change(screen.getAllByTestId("high-allegations")[0], {
        target: { value: "9" }
      });

      const nextButton = screen.getByTestId("next-button");
      fireEvent.click(nextButton);

      const expectedFormValues = {
        letterOfficers: [
          {
            fullName: "Officer 1",
            id: 0,
            caseOfficerId: 10,
            numHistoricalHighAllegations: "9",
            officerHistoryOptionId: "4"
          },
          {
            fullName: "Officer 2",
            id: 1,
            caseOfficerId: 11,
            officerHistoryOptionId: "4"
          },
          {
            fullName: "Officer 3",
            id: 2,
            caseOfficerId: 12,
            officerHistoryOptionId: "4"
          }
        ]
      };

      expect(editOfficerHistory).toHaveBeenCalledWith(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/recommended-actions`
      );
    });

    describe("Saves and Redirects when click Stepper Buttons", function () {
      let expectedFormValues;
      beforeEach(function () {
        editOfficerHistory.mockClear();
        fireEvent.change(
          result.baseElement.querySelector(
            "[name='letterOfficers[0].numHistoricalHighAllegations']"
          ),
          { target: { value: "9" } }
        );

        expectedFormValues = {
          letterOfficers: [
            {
              fullName: "Officer 1",
              id: 0,
              caseOfficerId: 10,
              numHistoricalHighAllegations: "9",
              officerHistoryOptionId: "4"
            },
            {
              fullName: "Officer 2",
              id: 1,
              caseOfficerId: 11,
              officerHistoryOptionId: "4"
            },
            {
              fullName: "Officer 3",
              id: 2,
              caseOfficerId: 12,
              officerHistoryOptionId: "4"
            }
          ]
        };
      });

      test("it dispatches edit and redirects to review letter when click review case details stepper button", () => {
        const reviewCaseDetailsButton = screen.getByTestId(
          "step-button-Review Case Details"
        );
        fireEvent.click(reviewCaseDetailsButton);

        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/review`
        );
      });

      test("it dispatches edit and redirects to officer history when click officer history stepper button", async () => {
        const reviewCaseDetailsButton = screen.getByTestId(
          "step-button-Officer Complaint Histories"
        );
        await userEvent.click(reviewCaseDetailsButton);
        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/officer-history`
        );
      });

      test("it dispatches edit and redirects to recommended actions when click recommended actions stepper button", () => {
        const recommendedActionsButton = screen.getByTestId(
          "step-button-Recommended Actions"
        );
        fireEvent.click(recommendedActionsButton);

        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/recommended-actions`
        );
      });

      test("it dispatches edit and redirects to preview when click preview stepper button", () => {
        const previewButton = screen.getByTestId("step-button-Preview");
        fireEvent.click(previewButton);

        expect(editOfficerHistory).toHaveBeenCalledWith(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/letter-preview`
        );
      });
    });
  });

  describe("no officers on the case", function () {
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
      const Wrapper = ({ children }) => {
        return children;
      };
      const FormWrapper = reduxForm({ form: "testForm" })(Wrapper);

      const history = createMemoryHistory();
      render(
        <Provider store={store}>
          <Router history={history}>
            <FormWrapper>
              <OfficerHistories match={{ params: { id: caseId } }} />
            </FormWrapper>
          </Router>
        </Provider>
      );
    });

    test("it does not submit the form but does redirect when no officers on the case when click back button", () => {
      const backButton = screen.getByTestId("back-button");
      fireEvent.click(backButton);

      expect(editOfficerHistory).not.toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        push(`/cases/${caseId}/letter/review`)
      );
    });

    test("it does not submit the form but does redirect when no officers on the case when click back to case button", () => {
      const backButton = screen.getByTestId("save-and-return-to-case-link");
      fireEvent.click(backButton);

      expect(editOfficerHistory).not.toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(push(`/cases/${caseId}`));
    });
  });
});
