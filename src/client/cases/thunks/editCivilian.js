import { push } from "react-router-redux";
import {
  closeEditDialog,
  editCivilianFailed,
  editCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const editCivilian = civilian => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push(`/login`));
      return dispatch(editCivilianFailed());
    }

    const response = await axios(`${hostname}/api/civilian/${civilian.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify(civilian)
    });

    dispatch(closeEditDialog());
    dispatch(editCivilianSuccess(response.data));
    return await dispatch(getCaseNotes(response.data.id));
  } catch (e) {
    return dispatch(editCivilianFailed());
  }
};

export default editCivilian;
