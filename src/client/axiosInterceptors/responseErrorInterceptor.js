import { push } from "connected-react-router";
import { snackbarError } from "../actionCreators/snackBarActionCreators";
import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import { resetCaseDetailsPage } from "../cases/CaseDetails/CaseDetails";

const responseErrorInterceptor = dispatch => {
  return error => {
    interceptError(error, dispatch);
  };
};

const interceptError = (error, dispatch) => {
  let { errorMessage, caseId } = getErrorMessageAndCaseIdFromErrorResponse(
    error
  );

  let statusCode = error.response.status;

  errorMessage = transformAndHandleError(
    errorMessage,
    caseId,
    statusCode,
    dispatch
  );

  throw new Boom(errorMessage, { statusCode: statusCode });
};

export const transformAndHandleError = (
  errorMessage,
  caseId,
  statusCode,
  dispatch,
  defaultRedirectUrl = null
) => {
  let { displayErrorMessage, redirectUrl } = transformErrorAndGetRedirect(
    errorMessage,
    statusCode,
    caseId
  );

  if (defaultRedirectUrl && !redirectUrl) {
    redirectUrl = defaultRedirectUrl;
  }

  if (redirectUrl) {
    reloadCaseDetailsPage(dispatch, caseId);
    dispatch(push(redirectUrl));
  }

  if (statusCode !== 401) {
    dispatch(snackbarError(displayErrorMessage));
  }

  return displayErrorMessage;
};

const transformErrorAndGetRedirect = (errorMessage, statusCode, caseId) => {
  if (statusIs400(statusCode)) {
    if (statusCode === 401) {
      return { displayErrorMessage: errorMessage, redirectUrl: "/login" };
    }
    return mapCustomErrorToDisplayAndRedirectUrl(errorMessage, caseId);
  }
  return { displayErrorMessage: errorMessage };
};

const mapCustomErrorToDisplayAndRedirectUrl = (errorMessage, caseId) => {
  switch (errorMessage) {
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS:
      return {
        displayErrorMessage: "Sorry, that page is not available",
        redirectUrl: `/cases/${caseId}`
      };
    case BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE:
      return {
        displayErrorMessage: errorMessage,
        redirectUrl: `/cases/${caseId}`
      };
    case BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST:
      return {
        displayErrorMessage: "Sorry, that page is not available",
        redirectUrl: `/`
      };
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE:
      return {
        displayErrorMessage: errorMessage,
        redirectUrl: `/cases/${caseId}`
      };
    default:
      return { displayErrorMessage: errorMessage };
  }
};

const getErrorMessageAndCaseIdFromErrorResponse = error => {
  let errorMessage = error.response.data.message;
  let caseId = error.response.data.caseId;

  if (error.response.status === 401) {
    errorMessage = error.message;
  }

  if (error.response.config.responseType === "arraybuffer") {
    const jsonData = getJsonDataFromArrayBufferResponse(error.response.data);
    errorMessage = jsonData.message;
    caseId = jsonData.caseId;
  }

  if (!errorMessage) {
    errorMessage =
      "Something went wrong and the request could not be completed";
  }

  return {
    errorMessage: errorMessage,
    caseId: caseId
  };
};

const getJsonDataFromArrayBufferResponse = arrayBuffer => {
  const decodedString = String.fromCharCode.apply(
    null,
    new Uint8Array(arrayBuffer)
  );
  return JSON.parse(decodedString);
};

const reloadCaseDetailsPage = (dispatch, caseId) => {
  resetCaseDetailsPage(dispatch);

  if (caseId) {
    dispatch(getCaseDetails(caseId));
  }
};

const statusIs400 = statusCode => {
  return statusCode >= 400 && statusCode < 500;
};

export default responseErrorInterceptor;
