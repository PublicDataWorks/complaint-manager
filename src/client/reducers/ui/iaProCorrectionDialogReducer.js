import {
  REMOVE_IAPRO_CORRECTION_DIALOG_CLOSED,
  REMOVE_IAPRO_CORRECTION_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialValues = {
  dialogOpen: false,
  fieldArrayName: undefined,
  correctionIndex: undefined
};

const iaProCorrectionDialogReducer = (state = initialValues, action) => {
  switch (action.type) {
    case REMOVE_IAPRO_CORRECTION_DIALOG_OPENED:
      return {
        ...state,
        dialogOpen: true,
        fieldArrayName: action.fieldArrayName,
        correctionIndex: action.correctionIndex
      };
    case REMOVE_IAPRO_CORRECTION_DIALOG_CLOSED:
      return initialValues;
    default:
      return state;
  }
};

export default iaProCorrectionDialogReducer;
