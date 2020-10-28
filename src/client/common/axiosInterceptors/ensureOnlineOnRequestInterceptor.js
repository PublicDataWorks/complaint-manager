import { snackbarError } from "../../policeDataManager/actionCreators/snackBarActionCreators";

const ensureOnlineOnRequestInterceptor = dispatch => config => {
  window.addEventListener("offline", () => {
    dispatch(snackbarError("No Internet Connection"));
  });

  return { ...config };
};

export default ensureOnlineOnRequestInterceptor;
