import {SNACKBAR_ERROR} from "../../sharedUtilities/constants";

export const openSnackbar = () =>{
    return {
        type: "OPEN_SNACKBAR"
    }
}

export const snackbarError = (message) => {
    return {
        type: SNACKBAR_ERROR,
        message
    }
}

export const closeSnackbar = () =>{
    return {
        type: "CLOSE_SNACKBAR"
    }
}