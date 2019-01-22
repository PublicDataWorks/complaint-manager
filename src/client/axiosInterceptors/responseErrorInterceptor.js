import { push } from "connected-react-router";
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
  let { errorMessage, redirectUrl } = getErrorMessageAndRedirectUrlFromResponse(
    error.response
  );

  if (!errorMessage) {
    return null;
  }

  if (redirectUrl) {
    dispatch(push(`${redirectUrl}`));
  }
  return errorMessage;
};

const getErrorMessageAndRedirectUrlFromResponse = response => {
  let responseData = response.data;
  if (response.config.responseType === "arraybuffer") {
    responseData = getJsonDataFromArrayBufferResponse(response.data);
  }
  return {
    errorMessage: responseData.message,
    redirectUrl: responseData.redirectUrl
  };
};

const getJsonDataFromArrayBufferResponse = arrayBuffer => {
  const decodedString = String.fromCharCode.apply(
    null,
    new Uint8Array(arrayBuffer)
  );
  return JSON.parse(decodedString);
};

const errorIs400 = error => {
  return error.response.status >= 400 && error.response.status < 500;
};

export default responseErrorInterceptor;
