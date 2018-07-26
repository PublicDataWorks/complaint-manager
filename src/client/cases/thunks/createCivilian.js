import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  closeEditDialog,
  createCivilianFailure,
  createCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const createCivilian = civilian => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push(`/login`));
      return dispatch(createCivilianFailure());
    }

    const response = await axios(`${hostname}/api/civilian`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify(civilian)
    });

    dispatch(createCivilianSuccess(response.data));
    dispatch(closeEditDialog());
    return await dispatch(getCaseNotes(response.data.id));
  } catch (e) {
    return dispatch(createCivilianFailure());
  }
};

export default createCivilian;
