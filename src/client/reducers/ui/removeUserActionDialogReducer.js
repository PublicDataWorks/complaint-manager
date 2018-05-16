import {
  REMOVE_USER_ACTION_DIALOG_CLOSED,
  REMOVE_USER_ACTION_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  dialogOpen: false,
  activity: {}
};

const removeUserActionDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_USER_ACTION_DIALOG_OPENED:
      return {
        dialogOpen: true,
        activity: action.activity
      };
    case REMOVE_USER_ACTION_DIALOG_CLOSED:
      return {
        ...initialState,
        activity: state.activity
      };
    default:
      return state;
  }
};

export default removeUserActionDialogReducer;
