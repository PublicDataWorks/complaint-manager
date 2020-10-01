import getAccessToken from "../auth/getAccessToken";
import { push } from "connected-react-router";

const ensureTokenOnRequestInterceptor = (
  dispatch,
  isAuthDisabled
) => config => {
  if (accessTokenHasExpired()) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  const token = getAccessToken();

  if (!token && !isAuthDisabled) {
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/callback"
    ) {
      localStorage.setItem("redirectUri", window.location.pathname);
    }
    dispatch(push("/login"));
    throw new Error("No access token found");
  }
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...(!isAuthDisabled && { Authorization: `Bearer ${token}` })
    }
  };
};

const accessTokenHasExpired = () => {
  return (
    localStorage.getItem("expires_at") &&
    localStorage.getItem("expires_at") < Date.now()
  );
};

export default ensureTokenOnRequestInterceptor;
