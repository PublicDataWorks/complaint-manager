import {
  USER_ACTION_DIALOG_CLOSED,
  USER_ACTION_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  dialogType: "Add",
  initialCaseNote: {}
};
const userActionDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_ACTION_DIALOG_OPENED:
      return {
        open: true,
        dialogType: action.dialogType,
        initialCaseNote: action.initialCaseNote
      };
    case USER_ACTION_DIALOG_CLOSED:
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
};

export default userActionDialogReducer;
