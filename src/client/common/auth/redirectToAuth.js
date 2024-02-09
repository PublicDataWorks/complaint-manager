import { push } from "connected-react-router";

const redirectToAuth = dispatch => {
  if (
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/callback"
  ) {
    localStorage.setItem("redirectUri", window.location.pathname);
  }
  
  window.onpopstate = () => {
    dispatch(push(localStorage.getItem("redirectUri") || "/login"));
  };

  dispatch(push("/login"));
};

export default redirectToAuth;
