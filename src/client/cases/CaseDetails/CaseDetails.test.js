import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import CaseDetails from "./CaseDetails";
import { Provider } from "react-redux";
import NavBar from "../../shared/components/NavBar/NavBar";
import { BrowserRouter as Router } from "react-router-dom";
import { containsText } from "../../testHelpers";
import { mockLocalStorage } from "../../../mockLocalStorage";
import Case from "../../testUtilities/case";
import getCaseDetails from "../thunks/getCaseDetails";
import createCivilian from "../thunks/createCivilian";
import {
  closeCaseNoteDialog,
  closeCaseStatusUpdateDialog,
  closeEditDialog,
  closeRemoveCaseNoteDialog,
  closeRemovePersonDialog,
  getCaseDetailsSuccess,
  openCaseNoteDialog,
  openCivilianDialog,
  openRemovePersonDialog
} from "../../actionCreators/casesActionCreators";
import { TIMEZONE } from "../../../sharedUtilities/constants";
import timezone from "moment-timezone";
import { initialize } from "redux-form";
import getLetterType from "../ReferralLetter/thunks/getLetterType";

jest.mock("../thunks/getCaseDetails", () => caseId => ({
  type: "MOCK_GET_CASE_DETAILS",
  caseId
}));
jest.mock("../ReferralLetter/thunks/getLetterType", () => caseId => ({
  type: "MOCK_GET_LETTER_TYPE",
  caseId
}));

jest.mock("../thunks/updateNarrative", () => () => ({
  type: "MOCK_UPDATE_NARRATIVE_THUNK"
}));

jest.mock("./CivilianDialog/MapServices/MapService");

describe("Case Details Component", () => {
  let caseDetails, expectedCase, dispatchSpy, store;
  beforeEach(() => {
    const incidentDateInUTC = "2017-12-25T06:00Z";
    mockLocalStorage();

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    expectedCase = new Case.Builder()
      .defaultCase()
      .withId(612)
      .withNarrativeDetails("Some initial narrative")
      .withIncidentDate(incidentDateInUTC)
      .build();

    store.dispatch(getCaseDetailsSuccess(expectedCase));

    caseDetails = mount(
      <Provider store={store}>
        <Router>
          <CaseDetails match={{ params: { id: expectedCase.id.toString() } }} />
        </Router>
      </Provider>
    );
  });

  test("should dispatch get case details action on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(
      getCaseDetails(expectedCase.id.toString())
    );
  });

  test("loads letter type on mount so message can be displayed", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(
      getLetterType(expectedCase.id.toString())
    );
  });

  test("should dispatch close dialog actions on unmount", () => {
    caseDetails.unmount();
    expect(dispatchSpy).toHaveBeenCalledWith(closeEditDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseNoteDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeRemoveCaseNoteDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeRemovePersonDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseStatusUpdateDialog());
  });

  describe("nav bar", () => {
    test("should display with case reference", () => {
      const navBar = caseDetails.find(NavBar);
      const expectedFormattedName = `Case #${expectedCase.caseReference}`;

      containsText(navBar, '[data-test="pageTitle"]', expectedFormattedName);
    });

    test("should display with case status", () => {
      const navBar = caseDetails.find(NavBar);
      containsText(navBar, '[data-test="caseStatusBox"]', expectedCase.status);
    });
  });

  describe("drawer", () => {
    test("should provide an option to go back to all cases", () => {
      containsText(
        caseDetails,
        '[data-test="all-cases-link"]',
        "Back to all Cases"
      );
    });

    test("should display Case # as a default section title", () => {
      containsText(
        caseDetails,
        '[data-test="case-reference"]',
        `Case #${expectedCase.caseReference}`
      );
    });

    test("should display created on date", () => {
      containsText(caseDetails, '[data-test="created-on"]', "Sep 13, 2015");
    });

    test("should display complaint type", () => {
      containsText(
        caseDetails,
        '[data-test="complaint-type"]',
        expectedCase.complaintType
      );
    });

    test("should display created by user", () => {
      containsText(
        caseDetails,
        '[data-test="created-by"]',
        expectedCase.createdBy
      );
    });

    test("should display assigned to user", () => {
      containsText(
        caseDetails,
        '[data-test="assigned-to"]',
        expectedCase.assignedTo
      );
    });
  });

  describe("main", () => {
    test("should open Add Civilian Dialog when Add Civilian button is clicked", () => {
      const addButton = caseDetails
        .find('button[data-test="addComplainantWitness"]')
        .first();
      addButton.simulate("click");

      const addCivilian = caseDetails.find(
        'li[data-test="addCivilianComplainantWitness"]'
      );
      addCivilian.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Add Civilian", "Create", createCivilian)
      );
    });

    test("should open dialog when remove civilian button is clicked", () => {
      const removeComplainantButton = caseDetails
        .find('[data-test="removeCivilianLink"]')
        .first();
      removeComplainantButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openRemovePersonDialog(
          expectedCase.complainantCivilians[0],
          "civilians"
        )
      );
    });

    test("should open and initialize Case Note Dialog when Add Case Note button is clicked", () => {
      const addCaseNoteButton = caseDetails.find(
        'button[data-test="addCaseNoteButton"]'
      );
      addCaseNoteButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        initialize("CaseNotes", {
          actionTakenAt: timezone
            .tz(new Date(Date.now()), TIMEZONE)
            .format("YYYY-MM-DDTHH:mm")
        })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(openCaseNoteDialog("Add", {}));
    });
  });
});
