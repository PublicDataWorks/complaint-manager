import { push } from "connected-react-router";

const redirectToAuth = dispatch => {
  if (
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/callback"
  ) {
    localStorage.setItem("redirectUri", window.location.pathname);
  }

  // Listen for the popstate event, which is fired when the user clicks the back button
  window.onpopstate = () => {
    dispatch(push("/login"));
  };

  dispatch(push("/login"));
};

export default redirectToAuth;
