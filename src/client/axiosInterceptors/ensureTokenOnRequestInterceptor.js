import getAccessToken from "../auth/getAccessToken";
import { push } from "connected-react-router";

const ensureTokenOnRequestInterceptor = dispatch => config => {
  const token = getAccessToken();
  console.log("Window location", window.location.href);
  if (
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/callback"
  ) {
    localStorage.setItem("redirectUri", window.location.pathname);
  }
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
