import {
  REMOVE_CASE_TAG_DIALOG_CLOSED,
  REMOVE_CASE_TAG_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  dialogOpen: false,
  caseTag: {
    tag: {
      name: ""
    }
  }
};

const removeCaseTagDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_CASE_TAG_DIALOG_OPENED:
      return {
        dialogOpen: true,
        caseTag: action.caseTag
      };
    case REMOVE_CASE_TAG_DIALOG_CLOSED:
      return {
        ...initialState,
        caseTag: state.caseTag
      };
    default:
      return state;
  }
};

export default removeCaseTagDialogReducer;
