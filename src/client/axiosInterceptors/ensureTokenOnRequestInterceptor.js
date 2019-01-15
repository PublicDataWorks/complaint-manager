import getAccessToken from "../auth/getAccessToken";
import { push } from "react-router-redux";

const ensureTokenOnRequestInterceptor = dispatch => config => {
  const token = getAccessToken();
  if (!token) {
    dispatch(push("/login"));
    throw new Error("No access token found");
  }
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
};

export default ensureTokenOnRequestInterceptor;
