import getAccessToken from "../../auth/getAccessToken";
import {
  closeRemoveUserActionDialog,
  removeUserActionFailure,
  removeUserActionSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import { push } from "react-router-redux";

const hostname = config[process.env.NODE_ENV].hostname;

const removeUserAction = (caseId, userActionId) => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await fetch(
      `${hostname}/api/cases/${caseId}/recent-activity/${userActionId}`,
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
        dispatch(closeRemoveUserActionDialog());
        const currentCase = await response.json();
        return dispatch(removeUserActionSuccess(currentCase));
      case 500:
        return dispatch(removeUserActionFailure());
      case 401:
        return dispatch(push("/login"));
      default:
        return dispatch(removeUserActionFailure());
    }
  } catch (error) {
    return dispatch(removeUserActionFailure());
  }
};

export default removeUserAction;
