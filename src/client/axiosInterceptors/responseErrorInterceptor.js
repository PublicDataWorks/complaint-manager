import { push } from "react-router-redux";
import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { snackbarError } from "../actionCreators/snackBarActionCreators";

const parseCaseIdFromError = error => {
  if (!error.request.responseURL) {
    return null;
  }
  const regex = /(?<=cases\/)[0-9]+/g;
  const found = error.request.responseURL.match(regex);
  if (!found) {
    return null;
  }
  return found[0];
};

const unauthorizedResponseInterceptor = (error, dispatch) => {
  if (error.response.status === 401) {
    dispatch(push("/login"));
    throw error;
  }
};

const badRequestInterceptor = (error, dispatch) => {
  let errorMessage;
  if (error.response.config.responseType === "arraybuffer") {
    errorMessage = getJsonMessageFromArrayBufferResponse(error.response.data);
  } else {
    errorMessage = error.response.data.message;
  }
  const caseId = parseCaseIdFromError(error);
  let snackbarErrorMsg;
  switch (errorMessage) {
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS:
      snackbarErrorMsg = "Sorry, that page is not available.";
      dispatch(push(`/cases/${caseId}`));
      break;
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE:
      dispatch(push(`/cases/${caseId}`));
      break;
  }
  return snackbarErrorMsg;
};

const responseErrorInterceptor = dispatch => error => {
  unauthorizedResponseInterceptor(error, dispatch);

  if (error.response.status === 400) {
    const snackbarErrorMsg = badRequestInterceptor(error, dispatch);
    dispatch(snackbarError(snackbarErrorMsg));
  }
  throw error;
};

const getJsonMessageFromArrayBufferResponse = arrayBuffer => {
  const decodedString = String.fromCharCode.apply(
    null,
    new Uint8Array(arrayBuffer)
  );
  const jsonResponse = JSON.parse(decodedString);
  return jsonResponse.message;
};

export default responseErrorInterceptor;
