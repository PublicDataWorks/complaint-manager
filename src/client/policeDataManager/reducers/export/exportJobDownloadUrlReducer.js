import {
  CLEAR_CURRENT_EXPORT_JOB,
  EXPORT_JOB_COMPLETED
} from "../../../../sharedUtilities/constants";

const exportJobDownloadUrlReducer = (state = null, action) => {
  switch (action.type) {
    case EXPORT_JOB_COMPLETED:
      return action.downloadUrl;
    case CLEAR_CURRENT_EXPORT_JOB:
      return null;
    default:
      return state;
  }
};

export default exportJobDownloadUrlReducer;
