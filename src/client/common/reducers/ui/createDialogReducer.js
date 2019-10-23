import {
  CREATE_DIALOG_CLOSED,
  CREATE_DIALOG_OPENED
} from "../../../../sharedUtilities/constants";
import { DialogTypes } from "../../actionCreators/dialogTypes";

const initialState = Object.keys(DialogTypes).reduce((state, dialogName) => {
  const dialogType = DialogTypes[dialogName];
  state[dialogType] = { open: false };
  return state;
}, {});

const createDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_DIALOG_OPENED:
      return {
        ...state,
        [action.dialogType]: {
          open: true
        }
      };
    case CREATE_DIALOG_CLOSED:
      return {
        ...state,
        [action.dialogType]: {
          open: false
        }
      };
    default:
      return state;
  }
};

export default createDialogReducer;
