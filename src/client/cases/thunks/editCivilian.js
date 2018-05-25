import { push } from "react-router-redux";
import {
  closeEditDialog,
  editCivilianFailed,
  editCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import getRecentActivity from "./getRecentActivity";

const hostname = config[process.env.NODE_ENV].hostname;

const editCivilian = civilian => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push(`/login`));
      return dispatch(editCivilianFailed());
    }

    const response = await fetch(`${hostname}/api/civilian/${civilian.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(civilian)
    });

    switch (response.status) {
      case 200:
        const caseDetails = await response.json();
        dispatch(closeEditDialog());
        dispatch(editCivilianSuccess(caseDetails));
        return await dispatch(getRecentActivity(caseDetails.id));
      case 401:
        dispatch(push(`/login`));
        return dispatch(editCivilianFailed());
      default:
        return dispatch(editCivilianFailed());
    }
  } catch (e) {
    return dispatch(editCivilianFailed());
  }
};

export default editCivilian;
