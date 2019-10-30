import {
  EXPORT_CASES_CONFIRMATION_OPENED,
  EXPORT_AUDIT_LOG_CONFIRMATION_OPENED,
  EXPORT_CONFIRMATION_CLOSED,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";

const initialState = {
  open: false,
  path: "",
  title: "",
  warningText: "",
  dateRange: null
};

const exportDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPORT_AUDIT_LOG_CONFIRMATION_OPENED:
      return {
        ...state,
        open: true,
        path: `/api/export/schedule/${JOB_OPERATION.AUDIT_LOG_EXPORT.name}`,
        title: "Audit Log",
        warningText: "a log of all actions taken in",
        dateRange: action.dateRange
      };
    case EXPORT_CASES_CONFIRMATION_OPENED:
      return {
        ...state,
        open: true,
        path: `/api/export/schedule/${JOB_OPERATION.CASE_EXPORT.name}`,
        title: "Cases",
        warningText: "all cases in",
        dateRange: action.dateRange
      };
    case EXPORT_CONFIRMATION_CLOSED:
      return {
        ...state,
        open: false,
        dateRange: null
      };
    default:
      return state;
  }
};

export default exportDialogReducer;
