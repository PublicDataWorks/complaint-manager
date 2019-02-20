import {
  CLOSE_INCOMPLETE_OFFICER_HISTORY_DIALOG,
  OPEN_INCOMPLETE_OFFICER_HISTORY_DIALOG
} from "../../../sharedUtilities/constants";

const initialState = { open: false };
const incompleteOfficerHistoryDialogReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case OPEN_INCOMPLETE_OFFICER_HISTORY_DIALOG:
      return { ...state, open: true, selectedTab: action.officerIndex };
    case CLOSE_INCOMPLETE_OFFICER_HISTORY_DIALOG:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default incompleteOfficerHistoryDialogReducer;
