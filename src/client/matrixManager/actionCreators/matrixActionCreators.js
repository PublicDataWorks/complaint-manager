import { MATRIX_CREATED_SUCCESS } from "../../../sharedUtilities/constants";

export const createMatrixSuccess = matrixDetails => ({
  type: MATRIX_CREATED_SUCCESS,
  matrixDetails
});
