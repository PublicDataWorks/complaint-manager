import snackbarReducer from "./snackbarReducer";
import {
  createUserFailure,
  createUserSuccess,
  requestUserCreation
} from "../../actionCreators/usersActionCreators";
import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  createCaseFailure,
  createCaseSuccess,
  editCivilianFailed,
  editCivilianSuccess,
  editCaseNoteFailure,
  editCaseNoteSuccess,
  removePersonFailure,
  removePersonSuccess,
  removeCaseNoteFailure,
  removeCaseNoteSuccess,
  requestCaseCreation,
  updateIncidentDetailsFailure,
  updateIncidentDetailsSuccess,
  updateNarrativeFailure,
  updateNarrativeSuccess,
  uploadAttachmentFailed,
  uploadAttachmentSuccess
} from "../../actionCreators/casesActionCreators";
import {
  closeSnackbar,
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import {
  removeAttachmentFailed,
  removeAttachmentSuccess
} from "../../actionCreators/attachmentsActionCreators";
import {
  ADD_CASE_NOTE_SUCCEEDED,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS
} from "../../../sharedUtilities/constants";
import {
  editCaseOfficerFailure,
  editCaseOfficerSuccess
} from "../../actionCreators/officersActionCreators";
import { getAllegationsFailed } from "../../actionCreators/allegationsActionCreators";

describe("snackbarReducer", () => {
  test("should default open to false", () => {
    const state = snackbarReducer(undefined, { type: "SOME_ACTION" });
    expect(state.open).toEqual(false);
    expect(state.success).toEqual(false);
    expect(state.message).toEqual("");
  });

  describe(SNACKBAR_ERROR, () => {
    test("should set open to true, success false, and message to given message", () => {
      const initialState = { open: false, success: false, message: "" };
      const state = snackbarReducer(
        initialState,
        snackbarError("Something happened!")
      );
      expect(state.open).toEqual(true);
      expect(state.success).toEqual(false);
      expect(state.message).toEqual("Something happened!");
    });
  });

  describe(SNACKBAR_SUCCESS, () => {
    test("should set open to true, success false, and message to given message", () => {
      const initialState = { open: false, success: false, message: "" };
      const state = snackbarReducer(
        initialState,
        snackbarSuccess("Something good happened!")
      );
      expect(state.open).toEqual(true);
      expect(state.success).toEqual(true);
      expect(state.message).toEqual("Something good happened!");
    });
  });

  describe("CLOSE_SNACKBAR", () => {
    test("should set open to false", () => {
      const initialState = {
        open: true,
        success: false,
        message: "You failed"
      };

      const state = snackbarReducer(initialState, closeSnackbar());

      expect(state.open).toBe(false);
      expect(state.success).toBe(false);
      expect(state.message).toBe("You failed");
    });
  });

  describe("USER_CREATION", () => {
    test("USER_CREATION_REQUESTED", () => {
      const initialState = { open: true, success: true, message: "blah" };
      const newState = snackbarReducer(initialState, requestUserCreation());

      expect(newState.open).toBe(false);
      expect(newState.success).toBe(false);
      expect(newState.message).toBe("");
    });

    test("USER_CREATED_SUCCESS", () => {
      const initialState = { open: false, success: false, message: "blah" };
      const newState = snackbarReducer(initialState, createUserSuccess());

      expect(newState.open).toBe(true);
      expect(newState.success).toBe(true);
      expect(newState.message).toBe("User was successfully created.");
    });

    test("USER_CREATION_FAILED", () => {
      const initialState = { open: false, success: true, message: "blah" };
      const newState = snackbarReducer(initialState, createUserFailure());

      expect(newState.open).toBe(true);
      expect(newState.success).toBeFalsy();
      expect(newState.message).toBe(
        "Something went wrong on our end and your user was not created. Please try again."
      );
    });
  });

  describe("CASE_CREATION", () => {
    test("CASE_CREATION_REQUESTED", () => {
      const initialState = { open: true, success: true, message: "balh" };
      const newState = snackbarReducer(initialState, requestCaseCreation());

      expect(newState.open).toBe(false);
      expect(newState.success).toEqual(false);
      expect(newState.message).toEqual("");
    });

    test("CASE_CREATED_SUCCESS", () => {
      const id = 1;
      const initialState = { open: false, success: false, message: "blah" };
      const newState = snackbarReducer(
        initialState,
        createCaseSuccess({ id: id })
      );

      expect(newState.open).toBe(true);
      expect(newState.success).toEqual(true);
      expect(newState.message).toEqual(`Case ${id} was successfully created.`);
    });

    test("CASE_CREATION_FAILED", () => {
      const initialState = { open: false, success: true, message: "" };
      const newState = snackbarReducer(
        initialState,
        createCaseFailure({ error: 500 })
      );

      expect(newState.open).toBe(true);
      expect(newState.success).toBe(false);
      expect(newState.message).toEqual(
        "Something went wrong on our end and your case was not created. Please try again."
      );
    });
  });

  describe("NARRATIVE_UPDATE", () => {
    describe("NARRATIVE_UPDATE_SUCCEEDED", () => {
      test("should set state correctly on successful update", () => {
        const newState = snackbarReducer(
          undefined,
          updateNarrativeSuccess("some case")
        );
        expect(newState.open).toEqual(true);
        expect(newState.success).toEqual(true);
        expect(newState.message).toEqual(
          "Your narrative was successfully updated"
        );
      });
    });

    describe("NARRATIVE_UPDATE_FAILED", () => {
      test("should set state correctly", () => {
        const initialState = {
          success: true,
          message: "some message",
          open: false
        };
        const newState = snackbarReducer(
          initialState,
          updateNarrativeFailure("some case")
        );

        expect(newState.success).toEqual(false);
        expect(newState.message).toEqual(
          "Something went wrong on our end and your case was not updated. Please try again."
        );
        expect(newState.open).toBeTruthy();
      });
    });
  });

  describe("EDIT_CIVILIAN", () => {
    test("EDIT_CIVILIAN_SUCCESS", () => {
      const initialState = { open: false };
      const newState = snackbarReducer(initialState, editCivilianSuccess());

      expect(newState.open).toBeTruthy();
      expect(newState.success).toBeTruthy();
      expect(newState.message).toEqual(
        "Complainant & Witnesses successfully updated"
      );
    });
    test("EDIT_CIVILIAN_FAILED", () => {
      const initialState = { open: true };
      const newState = snackbarReducer(initialState, editCivilianFailed());

      expect(newState.open).toBeTruthy();
      expect(newState.success).toBeFalsy();
      expect(newState.message).toEqual(
        "Something went wrong on our end and the civilian was not updated. Please try again."
      );
    });
  });

  describe("ATTACHMENT", () => {
    test("ATTACHMENT_UPLOAD_SUCCEEDED", () => {
      const initialState = { success: false, open: false, message: "" };
      const newState = snackbarReducer(
        initialState,
        uploadAttachmentSuccess("some case details")
      );

      expect(newState.open).toEqual(true);
      expect(newState.success).toEqual(true);
      expect(newState.message).toEqual("Your file was successfully attached");
    });

    test("ATTACHMENT_UPLOAD_FAILED", () => {
      const initialState = { success: true, open: false, message: "" };
      const newState = snackbarReducer(initialState, uploadAttachmentFailed());

      const expectedState = {
        open: true,
        success: false,
        message: "We could not attach your file. Please try again."
      };

      expect(newState).toEqual(expectedState);
    });

    test("REMOVE_ATTACHMENT_SUCCESS", () => {
      const initialState = { success: false, open: false, message: "" };
      const newState = snackbarReducer(
        initialState,
        removeAttachmentSuccess("attachments and the such")
      );

      const expectedState = {
        open: true,
        success: true,
        message: "Your attachment was successfully removed"
      };

      expect(newState).toEqual(expectedState);
    });

    test("REMOVE_ATTACHMENT_FAILED", () => {
      const initialState = { success: true, open: false, message: "" };
      const newState = snackbarReducer(initialState, removeAttachmentFailed());

      const expectedState = {
        open: true,
        success: false,
        message: "We could not remove your attachment. Please try again."
      };
      expect(newState).toEqual(expectedState);
    });
  });

  describe("CASE NOTE DIALOG", () => {
    test("ADD_CASE_NOTE_SUCCEEDED", () => {
      const initialState = { success: false, open: false, message: "" };
      const newState = snackbarReducer(initialState, addCaseNoteSuccess());

      const expectedState = {
        success: true,
        open: true,
        message: "Your action was successfully logged"
      };
      expect(newState).toEqual(expectedState);
    });
    test("ADD_CASE_NOTE_FAILED", () => {
      const initialState = { success: true, open: false, message: "" };
      const newState = snackbarReducer(initialState, addCaseNoteFailure());

      const expectedState = {
        success: false,
        open: true,
        message: "We could not log your action. Please try again."
      };
      expect(newState).toEqual(expectedState);
    });
    test("EDIT_CASE_NOTE_SUCCEEDED", () => {
      const initialState = { success: false, open: false, message: "" };
      const newState = snackbarReducer(initialState, editCaseNoteSuccess());

      const expectedState = {
        success: true,
        open: true,
        message: "Case note successfully updated."
      };
      expect(newState).toEqual(expectedState);
    });
    test("EDIT_CASE_NOTE_FAILED", () => {
      const initialState = { success: true, open: false, message: "" };
      const newState = snackbarReducer(initialState, editCaseNoteFailure());

      const expectedState = {
        success: false,
        open: true,
        message:
          "Something went wrong on our end and the case note was not updated. Please try again."
      };
      expect(newState).toEqual(expectedState);
    });
    test("REMOVE_CASE_NOTE_SUCCEEDED", () => {
      const initialState = { success: false, open: false, message: "" };
      const newState = snackbarReducer(
        initialState,
        removeCaseNoteSuccess({ caseDetails: "", caseNotes: "" })
      );

      const expectedState = {
        success: true,
        open: true,
        message: "Case note successfully removed."
      };
      expect(newState).toEqual(expectedState);
    });
    test("REMOVE_CASE_NOTE_FAILED", () => {
      const initialState = { success: true, open: false, message: "" };
      const newState = snackbarReducer(initialState, removeCaseNoteFailure());

      const expectedState = {
        success: false,
        open: true,
        message:
          "Something went wrong on our end and the case note was not removed. Please try again."
      };
      expect(newState).toEqual(expectedState);
    });
  });

  describe("INCIDENT_DETAILS", () => {
    test("INCIDENT_DETAILS_UPDATE_SUCCEEDED", () => {
      const initialState = { success: false, open: true, message: "" };
      const newState = snackbarReducer(
        initialState,
        updateIncidentDetailsSuccess()
      );

      const expectedState = {
        open: true,
        success: true,
        message: "Your Incident Details were successfully updated"
      };

      expect(newState).toEqual(expectedState);
    });

    test("INCIDENT_DETAILS_UPDATE_FAILED", () => {
      const initialState = { success: true, open: false, message: "" };
      const newState = snackbarReducer(
        initialState,
        updateIncidentDetailsFailure()
      );

      const expectedState = {
        open: true,
        success: false,
        message:
          "Something went wrong on our end and your case was not updated. Please try again."
      };

      expect(newState).toEqual(expectedState);
    });
  });

  describe("REMOVE_PERSON", () => {
    test("REMOVE_PERSON_FAILED", () => {
      const initialState = { success: true, open: false, message: "" };
      const newState = snackbarReducer(
        initialState,
        removePersonFailure("civilian")
      );

      const expectedState = {
        open: true,
        success: false,
        message:
          "Something went wrong on our end and your civilian was not removed. Please try again."
      };

      expect(newState).toEqual(expectedState);
    });

    test("REMOVE_PERSON_SUCCEEDED", () => {
      const initialState = { success: false, open: false, message: "" };
      const newState = snackbarReducer(
        initialState,
        removePersonSuccess({}, "civilian")
      );

      const expectedState = {
        open: true,
        success: true,
        message: "Civilian has been successfully removed."
      };

      expect(newState).toEqual(expectedState);
    });
  });

  describe("EDIT_OFFICER", () => {
    test("should show success snackbar on EDIT_OFFICER_SUCCEEDED", () => {
      const oldState = {
        open: false,
        success: false,
        message: ""
      };

      const newState = snackbarReducer(oldState, editCaseOfficerSuccess());
      const expectedState = {
        open: true,
        success: true,
        message: "Officer successfully updated"
      };

      expect(newState).toEqual(expectedState);
    });

    test("should display failure message on edit case failure", () => {
      const oldState = {
        open: false,
        success: true,
        message: ""
      };

      const newState = snackbarReducer(oldState, editCaseOfficerFailure());
      const expectedState = {
        success: false,
        open: true,
        message:
          "Something went wrong on our end and the officer was not updated. Please try again."
      };

      expect(newState).toEqual(expectedState);
    });

    test("should display failure message on allegation dropdown failure", () => {
      const newState = snackbarReducer(undefined, getAllegationsFailed());
      const expectedState = {
        success: false,
        open: true,
        message:
          "There was a problem loading this page. Please refresh and try again."
      };
      expect(newState).toEqual(expectedState);
    });
  });
});
