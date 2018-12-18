import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import { push } from "connected-react-router";
import {
  addOfficerToCaseSuccess,
  addOfficerToCaseFailure,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const addOfficer = (caseId, officerId, values) => async dispatch => {
  const payload = { officerId, ...values };

  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push("/login"));
      throw new Error("No access token found");
    }
    const response = await axios(
      `${hostname}/api/cases/${caseId}/cases-officers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(payload)
      }
    );

    dispatch(addOfficerToCaseSuccess(response.data));
    dispatch(clearSelectedOfficer());
    dispatch(snackbarSuccess(`Officer was successfully added`));
    dispatch(push(`/cases/${caseId}`));
  } catch (e) {
    dispatch(addOfficerToCaseFailure());
  }
};
export default addOfficer;
