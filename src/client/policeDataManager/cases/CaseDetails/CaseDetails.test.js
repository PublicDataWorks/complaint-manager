import React from "react";
import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import CaseDetails from "./CaseDetails";
import { Provider } from "react-redux";
import NavBar from "../../shared/components/NavBar/NavBar";
import { BrowserRouter as Router } from "react-router-dom";
import { containsText } from "../../../testHelpers";
import { mockLocalStorage } from "../../../../mockLocalStorage";
import Case from "../../../../sharedTestHelpers/case";
import getCaseDetails from "../thunks/getCaseDetails";
import createCivilian from "../thunks/createCivilian";
import {
  closeArchiveCaseDialog,
  closeCaseNoteDialog,
  closeCaseStatusUpdateDialog,
  closeEditCivilianDialog,
  closeEditIncidentDetailsDialog,
  closeRemoveAttachmentConfirmationDialog,
  closeRemoveCaseNoteDialog,
  closeRestoreArchivedCaseDialog,
  getCaseDetailsSuccess,
  openCaseNoteDialog,
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

  test("should dispatch get case details action when navigating from case to case", () => {
    const previousCase = new Case.Builder().defaultCase().withId(500).build();
    previousCase.status = CASE_STATUS.INITIAL;
    previousCase.nextStatus = CASE_STATUS.ACTIVE;

    store.dispatch(getCaseDetailsSuccess(previousCase));

    caseDetails = mount(
      <Provider store={store}>
        <Router>
          <CaseDetails match={{ params: { id: expectedCase.id.toString() } }} />
        </Router>
      </Provider>
    );

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

    caseDetails.update();

    expect(scrollToTop).toHaveBeenCalled();
  });

  test("should dispatch close dialogs and clear highlighted case note action on unmount", () => {
    caseDetails.unmount();
    expect(dispatchSpy).toHaveBeenCalledWith(reset(NARRATIVE_FORM));
    expect(dispatchSpy).toHaveBeenCalledWith(clearOfficerPanelData());
    expect(dispatchSpy).toHaveBeenCalledWith(closeEditCivilianDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseNoteDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseStatusUpdateDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeRemoveCaseNoteDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeEditIncidentDetailsDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeRestoreArchivedCaseDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(closeArchiveCaseDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(
      closeRemoveAttachmentConfirmationDialog()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(clearHighlightedCaseNote());
  });

  describe("nav bar", () => {
    test("should display with case reference", () => {
      const navBar = caseDetails.find(NavBar);
      const expectedFormattedName = `Case #${expectedCase.caseReference}`;

      containsText(navBar, '[data-testid="pageTitle"]', expectedFormattedName);
    });

    test("should display with case status", () => {
      const navBar = caseDetails.find(NavBar);
      containsText(
        navBar,
        '[data-testid="caseStatusBox"]',
        expectedCase.status
      );
    });
  });

  describe("drawer", () => {
    test("should provide an option to go back to all cases", () => {
      containsText(
        caseDetails,
        '[data-testid="all-cases-link"]',
        "Back to all Cases"
      );
    });

    test("should display Case # as a default section title", () => {
      containsText(
        caseDetails,
        '[data-testid="case-reference"]',
        `Case #${expectedCase.caseReference}`
      );
    });

    test("should display created on date", () => {
      containsText(caseDetails, '[data-testid="created-on"]', "Sep 13, 2015");
    });

    test("should display complaint type", () => {
      containsText(
        caseDetails,
        '[data-testid="complaint-type"]',
        expectedCase.complaintType
      );
    });

    test("should display created by user", () => {
      containsText(
        caseDetails,
        '[data-testid="created-by"]',
        expectedCase.createdBy
      );
    });

    test("should display assigned to user", () => {
      containsText(caseDetails, '[data-testid="assigned-to"]', "Fungi");
    });
  });

  describe("main", () => {
    test("should open Add Civilian Dialog when Add Civilian button is clicked", () => {
      const addButton = caseDetails
        .find('button[data-testid="addPersonOnCase"]')
        .first();
      addButton.simulate("click");

      const addCivilian = caseDetails.find(
        'li[data-testid="addCivilianPersonOnCase"]'
      );
      addCivilian.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Add Civilian", "Create", createCivilian)
      );
    });

    test("should open general add dialog when feature flag is turned on and Add Complainant button is clicked", () => {
      store.dispatch({
        type: GET_FEATURES_SUCCEEDED,
        features: { choosePersonTypeInAddDialog: true }
      });
      const addButton = caseDetails
        .find('button[data-testid="addPersonOnCase"]')
        .first();
      addButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Add Person to Case", "Create", createCivilian)
      );
    });

    test("should open dialog when remove civilian button is clicked", () => {
      const removeComplainantButton = caseDetails
        .find('[data-testid="removeCivilianLink"]')
        .first();
      removeComplainantButton.simulate("click");

      expect(
        caseDetails
          .find('[data-testid="confirmation-dialog-RemoveCivilian"]')
          .first()
          .text()
      ).toContain("Remove Civilian");
    });

    test("should open and initialize Case Note Dialog when Add Case Note button is clicked", () => {
      const addCaseNoteButton = caseDetails.find(
        'button[data-testid="addCaseNoteButton"]'
      );
      addCaseNoteButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        initialize("CaseNotes", {
          actionTakenAt: timezone
            .tz(new Date(Date.now()), userTimezone)
            .format("YYYY-MM-DDTHH:mm")
        })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(openCaseNoteDialog("Add", {}));
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

      caseDetails.update();

      const addButton = caseDetails
        .find('button[data-testid="addPersonOnCase"]')
        .at(2);

      addButton.simulate("click");

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

      caseDetails.update();

      const addAccusedMenuButton = caseDetails
        .find('[data-testid="addAccusedMenu"]')
        .first();

      expect(addAccusedMenuButton.exists()).toBeTruthy();
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

      caseDetails.update();

      const addButton = caseDetails
        .find('button[data-testid="addPersonOnCase"]')
        .at(2);

      addButton.simulate("click");

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

      caseDetails.update();

      const addAccusedMenuButton = caseDetails
        .find('[data-testid="addAccusedMenu"]')
        .first();

      expect(addAccusedMenuButton.exists()).toBeTruthy();
    });
  });
});
