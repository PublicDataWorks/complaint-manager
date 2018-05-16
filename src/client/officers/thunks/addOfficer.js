import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import { push } from "react-router-redux";
import {
  addOfficerToCaseSuccess,
  addOfficerToCaseFailure,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const addOfficer = (caseId, officerId, values) => async dispatch => {
  const payload = { officerId, ...values };

  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push("/login"));
      throw new Error("No access token found");
    }
    const response = await fetch(
      `${hostname}/api/cases/${caseId}/cases-officers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.status === 200) {
      dispatch(addOfficerToCaseSuccess(await response.json()));
      dispatch(clearSelectedOfficer());
      dispatch(
        snackbarSuccess(`Officer successfully added as ${values.roleOnCase}`)
      );
      dispatch(push(`/cases/${caseId}`));
    } else if (response.status === 401) {
      dispatch(push("/login"));
    } else {
      dispatch(addOfficerToCaseFailure());
    }
  } catch (e) {
    dispatch(addOfficerToCaseFailure());
  }
};
export default addOfficer;
