import { submit } from "redux-form";
import { isEqual } from "lodash";
import {
  NARRATIVE_FORM,
  SEARCHABLE_DATA_IS_CLEAN_AGAIN
} from "../../../sharedUtilities/constants";

const initialState = false;

const searchIndexReducer = (state = initialState, action = {}) => {
  const submitNarrativeFormAction = submit(NARRATIVE_FORM);
  if (isEqual(action, submitNarrativeFormAction)) {
    return true;
  }
  switch (action.type) {
    case SEARCHABLE_DATA_IS_CLEAN_AGAIN:
      return initialState;
    default:
      return state;
  }
};

export default searchIndexReducer;
