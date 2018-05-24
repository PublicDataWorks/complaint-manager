import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import {
  getAllegationsFailed,
  getAllegationsSuccess
} from "../../actionCreators/allegationsActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const getAllegationDropdownValues = () => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await fetch(`${hostname}/api/allegations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    switch (response.status) {
      case 200:
        const responseBody = await response.json();
        return dispatch(getAllegationsSuccess(responseBody));
      case 401:
        return dispatch(push("/login"));
      case 500:
        return dispatch(getAllegationsFailed());
      default:
        return dispatch(getAllegationsFailed());
    }
  } catch (e) {
    return dispatch(getAllegationsFailed());
  }
};

export default getAllegationDropdownValues;
