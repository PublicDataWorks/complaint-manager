import { push } from "react-router-redux";
import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { snackbarError } from "../actionCreators/snackBarActionCreators";

const responseErrorInterceptor = dispatch => error => {
  let snackbarErrorMessage = error.response.data.message;
  if (errorIs400(error)) {
    throwErrorIfUnauthorizedResponse(error, dispatch);
    snackbarErrorMessage = get400ErrorMessage(error, dispatch);
  }
  if (!snackbarErrorMessage) {
    snackbarErrorMessage =
      "Something went wrong and the request could not be completed.";
  }

  dispatch(snackbarError(snackbarErrorMessage));

  throw error;
};

const throwErrorIfUnauthorizedResponse = (error, dispatch) => {
  if (error.response.status === 401) {
    dispatch(push("/login"));
    throw error;
  }
};

const get400ErrorMessage = (error, dispatch) => {
  let errorMessage = getErrorMessageFromResponse(error.response);

  if (!errorMessage) {
    return null;
  }

  const caseId = parseCaseIdFromError(error);
  switch (errorMessage) {
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS:
      dispatch(push(`/cases/${caseId}`));
      return "Sorry, that page is not available";
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE:
      dispatch(push(`/cases/${caseId}`));
  }
  return errorMessage;
};

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

const getErrorMessageFromResponse = response => {
  if (response.config.responseType === "arraybuffer") {
    return getJsonMessageFromArrayBufferResponse(response.data);
  }
  return response.data.message;
};

const getJsonMessageFromArrayBufferResponse = arrayBuffer => {
  const decodedString = String.fromCharCode.apply(
    null,
    new Uint8Array(arrayBuffer)
  );
  const jsonResponse = JSON.parse(decodedString);
  return jsonResponse.message;
};

const errorIs400 = error => {
  return error.response.status >= 400 && error.response.status < 500;
};

export default responseErrorInterceptor;
