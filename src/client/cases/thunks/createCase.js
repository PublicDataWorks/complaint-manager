import {
  createCaseFailure,
  createCaseSuccess,
  requestCaseCreation
} from "../../actionCreators/casesActionCreators";
import { reset } from "redux-form";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";

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

    const response = await fetch(`${hostname}/api/cases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(creationDetails.caseDetails)
    });

    switch (response.status) {
      case 201:
        const createdCase = await response.json();
        dispatch(createCaseSuccess(createdCase));

        if (creationDetails.redirect) {
          if (
            creationDetails.caseDetails.case.complainantType ===
            "Police Officer"
          ) {
            dispatch(
              push(`/cases/${createdCase.id}/officers/search?role=Complainant`)
            );
          } else if (
            creationDetails.caseDetails.case.complainantType === "Civilian"
          ) {
            dispatch(push(`/cases/${createdCase.id}`));
          }
        }
        return dispatch(reset("CreateCase"));
      case 401:
        dispatch(push(`/login`));
        return dispatch(createCaseFailure());
      default:
        return dispatch(createCaseFailure());
    }
  } catch (e) {
    return dispatch(createCaseFailure());
  }
};

export default createCase;
