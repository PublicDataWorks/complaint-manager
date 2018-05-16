import { getCasesSuccess } from "../../actionCreators/casesActionCreators";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";

const hostname = config[process.env.NODE_ENV].hostname;

const getCases = () => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push("/login"));
      throw new Error("No access token found");
    }

    const response = await fetch(`${hostname}/api/cases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    switch (response.status) {
      case 200:
        const responseBody = await response.json();
        return dispatch(getCasesSuccess(responseBody.cases));
      case 401:
        return dispatch(push(`/login`));
      default:
        throw response.status;
    }
  } catch (e) {}
};

export default getCases;
