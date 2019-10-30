import {
  REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_CLOSED,
  REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_EXITED,
  REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_OPENED
} from "../../../../sharedUtilities/constants";

const initialValues = {
  dialogOpen: false,
  attachmentFileName: ""
};

const removeAttachmentConfirmationDialogReducer = (
  state = initialValues,
  action
) => {
  switch (action.type) {
    case REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_CLOSED:
      return {
        ...state,
        dialogOpen: false
      };
    case REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_EXITED:
      return {
        ...state,
        attachmentFileName: ""
      };
    case REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_OPENED:
      return {
        dialogOpen: true,
        attachmentFileName: action.attachmentFileName
      };
    default:
      return state;
  }
};

export default removeAttachmentConfirmationDialogReducer;
