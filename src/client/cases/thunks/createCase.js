import {
  closeCreateCaseDialog,
  createCaseFailure,
  createCaseSuccess,
  requestCaseCreation
} from "../../actionCreators/casesActionCreators";
import { reset } from "redux-form";
import { push } from "react-router-redux";
import axios from "axios";
import {
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";

const createCase = creationDetails => async dispatch => {
  dispatch(requestCaseCreation());
  try {
    const response = await axios.post(
      `api/cases`,
      JSON.stringify(creationDetails.caseDetails)
    );
    dispatch(createCaseSuccess(response.data));
    dispatch(closeCreateCaseDialog());
    if (creationDetails.redirect) {
      if (creationDetails.caseDetails.case.complaintType === RANK_INITIATED) {
        dispatch(push(`/cases/${response.data.id}/officers/search`));
      } else if (
        creationDetails.caseDetails.case.complaintType === CIVILIAN_INITIATED
      ) {
        dispatch(push(`/cases/${response.data.id}`));
      }
    }
    return dispatch(reset("CreateCase"));
  } catch (e) {
    return dispatch(createCaseFailure());
  }
};

export default createCase;
