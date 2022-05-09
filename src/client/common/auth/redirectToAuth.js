import { push } from "connected-react-router";

const redirectToAuth = (dispatch) => {
    if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/callback"
      ) {
        localStorage.setItem("redirectUri", window.location.pathname);
      }
      dispatch(push("/login"));
}

export default redirectToAuth;