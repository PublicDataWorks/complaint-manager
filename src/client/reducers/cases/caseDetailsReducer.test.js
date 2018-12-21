import caseDetailsReducer from "./caseDetailsReducer";
import {
  addCaseNoteSuccess,
  createCivilianSuccess,
  editCivilianSuccess,
  getCaseDetailsSuccess,
  getCaseNumberSuccess,
  removeCaseNoteSuccess,
  removePersonSuccess,
  updateIncidentDetailsSuccess,
  updateNarrativeSuccess,
  uploadAttachmentSuccess
} from "../../actionCreators/casesActionCreators";
import { removeAttachmentSuccess } from "../../actionCreators/attachmentsActionCreators";
import {
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  CASE_STATUS,
  CIVILIAN_CREATION_SUCCEEDED,
  REMOVE_ATTACHMENT_SUCCESS
} from "../../../sharedUtilities/constants";
import { addOfficerToCaseSuccess } from "../../actionCreators/officersActionCreators";
import { removeOfficerAllegationSuccess } from "../../actionCreators/allegationsActionCreators";

describe("caseDetailsReducers", () => {
  test("should default to empty object", () => {
    const newState = caseDetailsReducer(undefined, { type: "ACTION" });
    expect(newState).toEqual({});
  });

  describe("GET_CASE_DETAILS_SUCCESS", () => {
    test("should replace the default object in state", () => {
      const oldState = { aProp: "a value", bProp: "b value" };

      const caseDetails = { caseDetailProp: "case detail value" };
      const action = getCaseDetailsSuccess(caseDetails);

      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(caseDetails);
    });
  });

  describe("GET_CASE_NUMBER_SUCCESS", () => {
    test("should assign the case number to the new state", () => {
      const oldState = { aProp: "a value", bProp: "b value" };
      const caseDetails = { caseNumber: "CC2018-0034" };
      const action = getCaseNumberSuccess(caseDetails);
      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(caseDetails);
    });
  });

  describe("NARRATIVE_UPDATE_SUCCEEDED", () => {
    test("should update current case details", () => {
      const oldState = { caseDetailProp: "old detail value" };

      const caseDetails = { caseDetailProp: "new detail value" };
      const action = updateNarrativeSuccess(caseDetails);

      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(caseDetails);
    });
  });

  describe("INCIDENT_DETAILS_UPDATE_SUCCEEDED", () => {
    test("updates the case details", () => {
      const oldState = { caseDetailProp: "old detail value" };

      const caseDetails = { caseDetailProp: "new detail value" };
      const action = updateIncidentDetailsSuccess(caseDetails);

      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(caseDetails);
    });
  });

  describe(ADD_OFFICER_TO_CASE_SUCCEEDED, () => {
    test("updates case details", () => {
      const oldState = { caseDetailProp: "old detail value" };

      const caseDetails = { caseDetailProp: "new detail value" };
      const action = addOfficerToCaseSuccess(caseDetails);

      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(caseDetails);
    });
  });

  describe("ATTACHMENT_UPLOAD_SUCCEEDED", () => {
    test("should update current case details", () => {
      const oldState = { caseDetailProp: "old detail value" };

      const caseDetails = { caseDetailProp: "new  detail value" };
      const action = uploadAttachmentSuccess(caseDetails);

      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(caseDetails);
    });
  });

  describe("REMOVE_CASE_NOTE_SUCCEEDED", function() {
    test("should replace current case on remove case note", () => {
      const oldState = {
        some: "old state"
      };

      const caseNoteDetails = {
        caseDetails: {
          some: "new state"
        },
        caseNotes: {
          not: "copied over"
        }
      };
      const newState = caseDetailsReducer(
        oldState,
        removeCaseNoteSuccess(caseNoteDetails)
      );

      expect(newState).toEqual(caseNoteDetails.caseDetails);
    });
  });

  describe("EDIT_CIVILIAN_SUCCESS", () => {
    test("should replace current case on successful civilian edit", () => {
      const oldState = { caseDetailProp: "old detail value" };
      const caseDetails = { caseDetailProp: "new  detail value" };
      const action = editCivilianSuccess(caseDetails);
      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(caseDetails);
    });
  });

  describe(CIVILIAN_CREATION_SUCCEEDED, () => {
    test("should replace case details when adding civilian", () => {
      const oldState = { caseDetailProp: "old detail value" };
      const caseDetails = { caseDetailProp: "new  detail value" };
      const action = createCivilianSuccess(caseDetails);
      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(caseDetails);
    });
  });

  describe(REMOVE_ATTACHMENT_SUCCESS, () => {
    test("should update attachments when attachment removed", () => {
      const oldState = {
        attachment: [{ fileName: "sample.text" }, { fileName: "cool.jpg" }]
      };
      const updatedCaseDetails = {
        attachment: [{ fileName: "cool.jpg" }]
      };

      const action = removeAttachmentSuccess(updatedCaseDetails);
      const newState = caseDetailsReducer(oldState, action);

      expect(newState).toEqual(updatedCaseDetails);
    });
  });

  describe("ADD_CASE_NOTE_SUCCEEDED", () => {
    test("should set case status to Active if Initial", () => {
      const caseDetails = { status: CASE_STATUS.ACTIVE };
      const newState = caseDetailsReducer(
        undefined,
        addCaseNoteSuccess(caseDetails, undefined)
      );

      expect(newState).toEqual(caseDetails);
    });
  });

  describe("REMOVED_CIVILIAN_SUCCEEDED", () => {
    test("should update current case after civilian is removed", () => {
      const oldCaseDetails = {
        civilians: [{ id: 1 }]
      };

      const newCaseDetails = {
        civilians: []
      };

      const newState = caseDetailsReducer(
        oldCaseDetails,
        removePersonSuccess(newCaseDetails)
      );

      expect(newState).toEqual(newCaseDetails);
    });
  });

  describe("REMOVE_OFFICER_ALLEGATION_SUCCEEDED", () => {
    test("should update current case after officer allegation is removed", () => {
      const oldCaseDetails = { allegation: { details: "some details" } };
      const newCaseDetails = { allegation: {} };

      const newState = caseDetailsReducer(
        oldCaseDetails,
        removeOfficerAllegationSuccess(newCaseDetails)
      );
      expect(newState).toEqual(newCaseDetails);
    });
  });
});
