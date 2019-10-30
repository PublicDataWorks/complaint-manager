import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import { createMatrixSuccess } from "../../actionCreators/matrixActionCreators";
import axios from "axios";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";

const createMatrix = creationDetails => async dispatch => {
  try {
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
  } catch (e) {}
};

export default createMatrix;
