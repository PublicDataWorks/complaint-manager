import { snackbarSuccess } from "../../../policeDataManager/actionCreators/snackBarActionCreators";
import { createMatrixSuccess } from "../../actionCreators/matrixActionCreators";
import axios from "axios";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";
import { reset, startSubmit, stopSubmit } from "redux-form";
import { CREATE_MATRIX_FORM_NAME } from "../../../../sharedUtilities/constants";

const createMatrix = creationDetails => async dispatch => {
  try {
    dispatch(startSubmit(CREATE_MATRIX_FORM_NAME));
    const response = await axios.post(
      `api/matrix-manager/matrices`,
      JSON.stringify(creationDetails)
    );
    dispatch(
      snackbarSuccess(
        `Matrix was successfully created: PIB Control #${creationDetails.pibControlNumber}`
      )
    );
    dispatch(createMatrixSuccess(response.data));
    dispatch(closeCreateDialog(DialogTypes.MATRIX));
    dispatch(stopSubmit(CREATE_MATRIX_FORM_NAME));
    return dispatch(reset(CREATE_MATRIX_FORM_NAME));
  } catch (e) {
    dispatch(stopSubmit(CREATE_MATRIX_FORM_NAME));
  }
};

export default createMatrix;
