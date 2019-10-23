import {
  CREATE_DIALOG_CLOSED,
  CREATE_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

export const openCreateDialog = dialogType => ({
  type: CREATE_DIALOG_OPENED,
  dialogType
});
export const closeCreateDialog = dialogType => ({
  type: CREATE_DIALOG_CLOSED,
  dialogType
});
