import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import {
  closeRemovePersonDialog,
  removePersonFailure,
  removePersonSuccess
} from "../../actionCreators/casesActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const removePerson = ({ personType, id, caseId }) => async dispatch => {
  const personTypeForDisplay =
    personType === "civilians" ? "civilian" : "officer";
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await fetch(
      `${hostname}/api/cases/${caseId}/${personType}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    switch (response.status) {
      case 200:
        const caseDetails = await response.json();
        dispatch(closeRemovePersonDialog());
        return dispatch(removePersonSuccess(caseDetails, personTypeForDisplay));
      case 401:
        return dispatch(push("/login"));
      case 500:
        return dispatch(removePersonFailure(personTypeForDisplay));
      default:
        return dispatch(removePersonFailure(personTypeForDisplay));
    }
  } catch (error) {
    return dispatch(removePersonFailure(personTypeForDisplay));
  }
};

export default removePerson;
