import {
  REMOVE_USER_ACTION_DIALOG_CLOSED,
  REMOVE_USER_ACTION_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  dialogOpen: false,
  caseId: null,
  userActionId: null
};

const removeUserActionDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_USER_ACTION_DIALOG_OPENED:
      return {
        dialogOpen: true,
        caseId: action.caseId,
        userActionId: action.userActionId
      };
    case REMOVE_USER_ACTION_DIALOG_CLOSED:
      return initialState;
    default:
      return state;
  }
};

export default removeUserActionDialogReducer;
