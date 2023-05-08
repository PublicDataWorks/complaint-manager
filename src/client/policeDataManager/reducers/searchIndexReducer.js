import { submit, startSubmit, setSubmitSucceeded } from "redux-form";
import { isEqual } from "lodash";
import {
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  CASE_CREATED_SUCCESS,
  CIVILIAN_CREATION_SUCCEEDED,
  CREATE_CASE_TAG_SUCCESS,
  EDIT_CASE_OFFICER_SUCCEEDED,
  EDIT_CIVILIAN_SUCCESS,
  MANUALLY_ENTER_INMATE_FORM,
  NARRATIVE_FORM,
  REMOVE_CASE_TAG_SUCCESS,
  SEARCHABLE_DATA_IS_CLEAN_AGAIN,
  SELECTED_INMATE_FORM
} from "../../../sharedUtilities/constants";

const initialState = false;

const searchIndexReducer = (state = initialState, action = {}) => {
  const submitNarrativeFormAction = submit(NARRATIVE_FORM);
  if (isEqual(action, submitNarrativeFormAction)) {
    return true;
  }

  const inmateFormStartSubmitAction = startSubmit(SELECTED_INMATE_FORM);
  if (isEqual(action, inmateFormStartSubmitAction)) {
    return true;
  }

  const manuallyEnterInmateFormStartSubmitAction = setSubmitSucceeded(
    MANUALLY_ENTER_INMATE_FORM
  );
  if (isEqual(action, manuallyEnterInmateFormStartSubmitAction)) {
    return true;
  }

  switch (action.type) {
    case SEARCHABLE_DATA_IS_CLEAN_AGAIN:
      return initialState;
    case CIVILIAN_CREATION_SUCCEEDED:
    case EDIT_CIVILIAN_SUCCESS:
    case ADD_OFFICER_TO_CASE_SUCCEEDED:
    case EDIT_CASE_OFFICER_SUCCEEDED:
    case CREATE_CASE_TAG_SUCCESS:
    case REMOVE_CASE_TAG_SUCCESS:
    case CASE_CREATED_SUCCESS:
      return true;
    default:
      return state;
  }
};

export default searchIndexReducer;
