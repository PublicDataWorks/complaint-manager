import {
  closeCreateCaseDialog,
  createCaseFailure,
  createCaseSuccess,
  requestCaseCreation
} from "../../actionCreators/casesActionCreators";
import { reset } from "redux-form";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import axios from "axios";
import config from "../../config/config";

const hostname = config[process.env.NODE_ENV].hostname;

const createCase = creationDetails => async dispatch => {
  dispatch(requestCaseCreation());

  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push(`/login`));
      return dispatch(createCaseFailure());
    }

    const response = await axios(`${hostname}/api/cases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify(creationDetails.caseDetails)
    });

    dispatch(createCaseSuccess(response.data));
    dispatch(closeCreateCaseDialog());
    if (creationDetails.redirect) {
      if (
        creationDetails.caseDetails.case.complainantType === "Police Officer"
      ) {
        dispatch(
          push(`/cases/${response.data.id}/officers/search?role=Complainant`)
        );
      } else if (
        creationDetails.caseDetails.case.complainantType === "Civilian"
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
