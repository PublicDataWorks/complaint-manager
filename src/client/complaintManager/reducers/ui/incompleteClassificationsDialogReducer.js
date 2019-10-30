import {
  CLOSE_INCOMPLETE_CLASSIFICATIONS_DIALOG,
  OPEN_INCOMPLETE_CLASSIFICATION_DIALOG
} from "../../../../sharedUtilities/constants";

const initialState = { open: false };
const incompleteClassificationsDialogReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case OPEN_INCOMPLETE_CLASSIFICATION_DIALOG:
      return { ...state, open: true };
    case CLOSE_INCOMPLETE_CLASSIFICATIONS_DIALOG:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default incompleteClassificationsDialogReducer;
