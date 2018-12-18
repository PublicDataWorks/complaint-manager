import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import config from "../../config/config";
import {
  closeRemovePersonDialog,
  removePersonFailure,
  removePersonSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const removePerson = ({ personType, id, caseId }) => async dispatch => {
  const personTypeForDisplay =
    personType === "civilians" ? "civilian" : "officer";
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${caseId}/${personType}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch(closeRemovePersonDialog());
    return dispatch(removePersonSuccess(response.data, personTypeForDisplay));
  } catch (error) {
    return dispatch(removePersonFailure(personTypeForDisplay));
  }
};

export default removePerson;
