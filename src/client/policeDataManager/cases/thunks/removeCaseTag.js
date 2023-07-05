import { REMOVE_CASE_TAG_FORM_NAME } from "../../../../sharedUtilities/constants";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { removeCaseTagSuccess } from "../../actionCreators/casesActionCreators";

const removeCaseTag = (caseId, caseTagId) => async dispatch => {
  try {
    dispatch(startSubmit(REMOVE_CASE_TAG_FORM_NAME));
    const response = await axios.delete(
      `api/cases/${caseId}/case-tags/${caseTagId}`
    );
    dispatch(stopSubmit(REMOVE_CASE_TAG_FORM_NAME));
    dispatch(snackbarSuccess("Case tag was successfully removed"));
    return dispatch(removeCaseTagSuccess(response.data));
  } catch (error) {
    dispatch(stopSubmit(REMOVE_CASE_TAG_FORM_NAME));
  }
};

export default removeCaseTag;
