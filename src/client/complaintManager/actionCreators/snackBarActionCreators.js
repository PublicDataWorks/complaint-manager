import {
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS
} from "../../../sharedUtilities/constants";

export const openSnackbar = () => {
  return {
    type: "OPEN_SNACKBAR"
  };
};

export const snackbarError = message => {
  return {
    type: SNACKBAR_ERROR,
    message
  };
};

export const snackbarSuccess = message => {
  return {
    type: SNACKBAR_SUCCESS,
    message
  };
};

export const closeSnackbar = () => {
  return {
    type: "CLOSE_SNACKBAR"
  };
};
