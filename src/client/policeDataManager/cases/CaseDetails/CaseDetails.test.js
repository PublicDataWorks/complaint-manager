import React from "react";
import createConfiguredStore from "../../../createConfiguredStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CaseDetails from "./CaseDetails";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { mockLocalStorage } from "../../../../mockLocalStorage";
import Case from "../../../../sharedTestHelpers/case";
import getCaseDetails from "../thunks/getCaseDetails";
import createCivilian from "../thunks/createCivilian";
import {
  closeCaseStatusUpdateDialog,
  closeEditCivilianDialog,
  closeEditIncidentDetailsDialog,
  closeRemoveAttachmentConfirmationDialog,
  closeRemoveCaseNoteDialog,
  closeRestoreArchivedCaseDialog,
  getCaseDetailsSuccess,
  openCivilianDialog
} from "../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  GET_CONFIGS_SUCCEEDED,
  GET_FEATURES_SUCCEEDED,
  GET_USERS_SUCCESS,
  NARRATIVE_FORM,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import timezone from "moment-timezone";
import { initialize, reset } from "redux-form";
import { scrollToTop } from "../../../ScrollToTop";
import { clearOfficerPanelData } from "../../actionCreators/accusedOfficerPanelsActionCreators";
import { clearHighlightedCaseNote } from "../../actionCreators/highlightCaseNoteActionCreators";
import { userTimezone } from "../../../common/helpers/userTimezone";
import nock from "nock";

require("../../testUtilities/MockMutationObserver");

jest.mock("../../../ScrollToTop", () => ({
  scrollToTop: jest.fn(() => "MOCK_SCROLL_TO_TOP")
}));

jest.mock("../thunks/getCaseDetails", () => caseId => ({
  type: "MOCK_GET_CASE_DETAILS",
  caseId
}));
jest.mock(
  "../ReferralLetter/thunks/getReferralLetterEditStatus",
  () => caseId => ({
    type: "MOCK_GET_LETTER_TYPE",
    caseId
  })
);

jest.mock("../thunks/updateNarrative", () => () => ({
  type: "MOCK_UPDATE_NARRATIVE_THUNK"
}));

jest.mock("./PersonOnCaseDialog/MapServices/MapService");

describe("Case Details Component", () => {
  let unmount, expectedCase, dispatchSpy, store;

  beforeEach(() => {
    const incidentDateInUTC = "2017-12-25T06:00Z";
    mockLocalStorage();

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    nock("http://localhost")
      .get("/api/priority-levels")
      .reply(() => [200, ["One", 1]]);

    nock("http://localhost")
      .get("/api/priority-reasons")
      .reply(() => [200, ["Disaster", 1]]);

    nock("http://localhost")
      .get("/api/cases/612/case-notes")
      .reply(() => [200, []]);

    nock("http://localhost")
      .get("/api/case-statuses")
      .reply(() => [200, [{ id: 1, name: "Initial", orderKey: 0 }]]);

    nock("http://localhost")
      .get("/api/users")
      .reply(() => [200, []]);

    expectedCase = new Case.Builder()
      .defaultCase()
      .withId(612)
      .withNarrativeDetails("Some initial narrative")
      .withIncidentDate(incidentDateInUTC)
      .build();

    expectedCase.status = CASE_STATUS.INITIAL;
    expectedCase.nextStatus = CASE_STATUS.ACTIVE;
    expectedCase.complaintType = CIVILIAN_INITIATED;

    store.dispatch(getCaseDetailsSuccess(expectedCase));
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: {
        permissions: [
          USER_PERMISSIONS.CREATE_CASE_NOTE,
          USER_PERMISSIONS.EDIT_CASE
        ]
      }
    });
    store.dispatch({
      type: GET_CONFIGS_SUCCEEDED,
      payload: { pd: "LAPD" }
    });
    store.dispatch({
      type: GET_USERS_SUCCESS,
      users: [{ email: expectedCase.assignedTo, name: "Fungi" }]
    });

    const result = render(
      <Provider store={store}>
        <Router>
          <CaseDetails match={{ params: { id: expectedCase.id.toString() } }} />
        </Router>
      </Provider>
    );

    unmount = result.unmount;
  });

  test("should dispatch get case details action on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(
      getCaseDetails(expectedCase.id.toString())
    );
  });

  test("should dispatch get case details action when navigating from case to case", () => {
    const previousCase = new Case.Builder().defaultCase().withId(500).build();
    previousCase.status = CASE_STATUS.INITIAL;
    previousCase.nextStatus = CASE_STATUS.ACTIVE;

    store.dispatch(getCaseDetailsSuccess(previousCase));

    expect(dispatchSpy).toHaveBeenCalledWith(
      getCaseDetails(expectedCase.id.toString())
    );
  });

  test("should scroll to top", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: expectedCase.id,
        complainantCivilians: [],
        complainantOfficers: [],
        witnessCivilians: [],
        witnessOfficers: [],
        createdAt: null,
        isArchived: true
      })
    );

    expect(scrollToTop).toHaveBeenCalled();
  });

  test("should dispatch close dialogs and clear highlighted case note action on unmount", () => {
    unmount();
    expect(dispatchSpy).toHaveBeenCalledWith(reset(NARRATIVE_FORM));
    expect(dispatchSpy).toHaveBeenCalledWith(clearOfficerPanelData());
    expect(dispatchSpy).toHaveBeenCalledWith(closeEditCivilianDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseStatusUpdateDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeRemoveCaseNoteDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeEditIncidentDetailsDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeRestoreArchivedCaseDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(
      closeRemoveAttachmentConfirmationDialog()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(clearHighlightedCaseNote());
  });

  describe("nav bar", () => {
    test("should display with case reference", () => {
      const navBar = screen.getByTestId("header");
      const expectedFormattedName = `Case #${expectedCase.caseReference}`;

      expect(screen.getByTestId("pageTitle").textContent).toContain(
        expectedFormattedName
      );
    });

    test("should display with case status", () => {
      const navBar = screen.getByTestId("header");
      expect(screen.getByTestId("caseStatusBox").textContent).toEqual(
        expectedCase.status
      );
    });
  });

  describe("drawer", () => {
    test("should provide an option to go back to all cases", () => {
      expect(screen.getByTestId("all-cases-link").textContent).toEqual(
        "Back to all Cases"
      );
    });

    test("should display Case # as a default section title", () => {
      expect(screen.getByTestId("case-reference").textContent).toEqual(
        `Case #${expectedCase.caseReference}`
      );
    });

    test("should display created on date", () => {
      expect(screen.getByTestId("created-on").textContent).toEqual(
        "Sep 13, 2015"
      );
    });

    test("should display complaint type", () => {
      expect(screen.getByTestId("complaint-type").textContent).toEqual(
        expectedCase.complaintType
      );
    });

    test("should display created by user", () => {
      expect(screen.getByTestId("created-by").textContent).toEqual(
        expectedCase.createdBy
      );
    });

    test("should display assigned to user", () => {
      expect(screen.getByTestId("assigned-to").textContent).toEqual("Fungi");
    });
  });

  describe("main", () => {
    test("should open Add Civilian Dialog when Add Civilian button is clicked", () => {
      const addButton = screen.getAllByTestId("addPersonOnCase")[0];
      userEvent.click(addButton);

      const addCivilian = screen.getByTestId("addCivilianPersonOnCase");
      userEvent.click(addCivilian);

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Add Civilian", "Create", createCivilian)
      );
    });

    test("should open general add dialog when feature flag is turned on and Add Complainant button is clicked", () => {
      store.dispatch({
        type: GET_FEATURES_SUCCEEDED,
        features: { choosePersonTypeInAddDialog: true }
      });
      const addButton = screen.getAllByTestId("addPersonOnCase")[0];
      userEvent.click(addButton);

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Add Person to Case", "Create", createCivilian)
      );
    });

    test("should open dialog when remove civilian button is clicked", () => {
      const removeComplainantButton =
        screen.getAllByTestId("removeCivilianLink")[1];
      userEvent.click(removeComplainantButton);

      expect(
        screen.getByTestId("confirmation-dialog-RemoveCivilian").textContent
      ).toContain("Remove Civilian");
    });

    test("should open and initialize Case Note Dialog when Add Case Note button is clicked", () => {
      const addCaseNoteButton = screen.getByTestId("addCaseNoteButton");
      userEvent.click(addCaseNoteButton);

      expect(dispatchSpy).toHaveBeenCalledWith(
        initialize("CaseNotes", {
          actionTakenAt: timezone
            .tz(new Date(Date.now()), userTimezone)
            .format("YYYY-MM-DDTHH:mm")
        })
      );
      expect(screen.getByTestId("caseNoteDialogTitle")).toBeTruthy();
    });
  });

  describe("add accused", () => {
    test("Should open openCivilianDialog when allowAllTypesToBeAccused is true and add accused button is clicked (prison oversite)", () => {
      store.dispatch({
        type: GET_FEATURES_SUCCEEDED,
        features: {
          choosePersonTypeInAddDialog: true,
          allowAllTypesToBeAccused: true
        }
      });

      const addButton = screen.getAllByTestId("addPersonOnCase")[1];

      userEvent.click(addButton);

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Add Person to Case", "Create", createCivilian)
      );
    });

    test("Should show menu options when allowAllTypesToBeAccused is false and add accused button is clicked (police oversite)", () => {
      store.dispatch({
        type: GET_FEATURES_SUCCEEDED,
        features: {
          choosePersonTypeInAddDialog: true,
          allowAllTypesToBeAccused: false
        }
      });

      const addAccusedMenuButton = screen.getByTestId("addAccusedMenu");

      expect(addAccusedMenuButton).toBeTruthy();
    });
  });

  describe("add accused", () => {
    test("Should open openCivilianDialog when allowAllTypesToBeAccused is true and add accused button is clicked (prison oversite)", () => {
      store.dispatch({
        type: GET_FEATURES_SUCCEEDED,
        features: {
          choosePersonTypeInAddDialog: true,
          allowAllTypesToBeAccused: true
        }
      });

      const addButton = screen.getAllByTestId("addPersonOnCase")[1];

      userEvent.click(addButton);

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Add Person to Case", "Create", createCivilian)
      );
    });

    test("Should show menu options when allowAllTypesToBeAccused is false and add accused button is clicked (police oversite)", () => {
      store.dispatch({
        type: GET_FEATURES_SUCCEEDED,
        features: {
          choosePersonTypeInAddDialog: true,
          allowAllTypesToBeAccused: false
        }
      });

      const addAccusedMenuButton = screen.getByTestId("addAccusedMenu");

      expect(addAccusedMenuButton).toBeTruthy();
    });
  });
});
