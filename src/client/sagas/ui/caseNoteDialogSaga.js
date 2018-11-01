import addCaseNote from "../../cases/thunks/addCaseNote";
import editCaseNote from "../../cases/thunks/editCaseNote";
import { take, put, race } from "redux-saga/effects";
import { delay } from "redux-saga";
import {
  CASE_NOTE_DIALOG_CLOSED,
  ADD_CASE_NOTE_REQUEST,
  EDIT_CASE_NOTE_REQUEST,
  DEBOUNCE_DELAY,
  REMOVE_CASE_NOTE_REQUEST,
  REMOVE_CASE_NOTE_DIALOG_CLOSED
} from "../../../sharedUtilities/constants";
import { duration } from "@material-ui/core/styles/transitions";
import removeCaseNote from "../../cases/thunks/removeCaseNote";

const successPattern = action => action.type.includes("SUCCEEDED");
const failurePattern = action => action.type.includes("FAILED");
const caseNotesRequestPattern = [
  ADD_CASE_NOTE_REQUEST,
  EDIT_CASE_NOTE_REQUEST,
  REMOVE_CASE_NOTE_REQUEST
];

/*
  This saga describes the control flow for a CaseNoteDialog Add or Edit form submission.

  Duplicate form submissions are prevented by ensuring that the Dialog component has time to
  execute its fade out transition after dispatching a CASE_NOTE_DIALOG_CLOSED action. The saga
  won't accept additional request actions until after the transition duration has elapsed, in which case
  the submit button will have unmounted, preventing double entries.

  If a form submissions fails, subsequent calls are debounced to prevent spamming the sever with error calls.
 */
export function* caseNoteDialogSaga() {
  while (true) {
    const action = yield take(caseNotesRequestPattern);
    if (action.type === ADD_CASE_NOTE_REQUEST) {
      yield put(addCaseNote(action.values));
    }
    if (action.type === EDIT_CASE_NOTE_REQUEST) {
      yield put(editCaseNote(action.values));
    }
    if (action.type === REMOVE_CASE_NOTE_REQUEST) {
      yield put(removeCaseNote(action.caseId, action.caseNoteId));
    }
    const result = yield take([successPattern, failurePattern]);
    if (successPattern(result)) {
      yield take([CASE_NOTE_DIALOG_CLOSED, REMOVE_CASE_NOTE_DIALOG_CLOSED]);
      yield delay(duration.leavingScreen);
    } else {
      let debounce = true;
      while (debounce) {
        const res = yield race({
          debounceDelay: delay(DEBOUNCE_DELAY),
          _: take(caseNotesRequestPattern)
        });
        if (res.hasOwnProperty("debounceDelay")) {
          break;
        }
      }
    }
  }
}
