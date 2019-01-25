import { push } from "connected-react-router";
import { snackbarError } from "../actionCreators/snackBarActionCreators";
import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { clearOfficerPanelData } from "../actionCreators/accusedOfficerPanelsActionCreators";
import {
  closeCaseNoteDialog,
  closeCaseStatusUpdateDialog,
  closeEditCivilianDialog,
  closeEditIncidentDetailsDialog,
  closeRemoveCaseNoteDialog,
  closeRemovePersonDialog
} from "../actionCreators/casesActionCreators";

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
  let {
    errorMessageFromResponse,
    caseId
  } = getErrorMessageAndCaseIdFromResponse(error.response);

  if (!errorMessageFromResponse) {
    return null;
  }

  let { errorMessage, redirectUrl } = getErrorMessageToDisplayAndRedirectUrl(
    errorMessageFromResponse,
    caseId
  );

  if (redirectUrl) {
    resetCaseDetailsPage(dispatch);
    dispatch(push(`${redirectUrl}`));
  }
  return errorMessage;
};

const getErrorMessageToDisplayAndRedirectUrl = (boomErrorMessage, caseId) => {
  switch (boomErrorMessage) {
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS:
      return {
        errorMessage: "Sorry, that page is not available",
        redirectUrl: `/cases/${caseId}`
      };
    case BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE:
      return {
        errorMessage: "Sorry, that page is not available",
        redirectUrl: `/cases/${caseId}`
      };
    case BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST:
      return {
        errorMessage: "Sorry, that page is not available",
        redirectUrl: `/`
      };
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE:
      return {
        errorMessage: boomErrorMessage,
        redirectUrl: `/cases/${caseId}`
      };
    default:
      return { errorMessage: boomErrorMessage };
  }
};

const getErrorMessageAndCaseIdFromResponse = response => {
  let responseData = response.data;
  if (response.config.responseType === "arraybuffer") {
    responseData = getJsonDataFromArrayBufferResponse(response.data);
  }
  return {
    errorMessageFromResponse: responseData.message,
    caseId: responseData.caseId
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

const resetCaseDetailsPage = dispatch => {
  dispatch(clearOfficerPanelData());
  dispatch(closeEditCivilianDialog());
  dispatch(closeCaseNoteDialog());
  dispatch(closeCaseStatusUpdateDialog());
  dispatch(closeRemoveCaseNoteDialog());
  dispatch(closeRemovePersonDialog());
  dispatch(closeEditIncidentDetailsDialog());
};

export default responseErrorInterceptor;
