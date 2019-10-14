import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import axios from "axios/index";

const editClassifications = (
  caseId,
  classificationValues
) => async dispatch => {
  try {
    await axios.put(
      `api/cases/${caseId}/referral-letter/classifications`,
      classificationValues
    );
    dispatch(snackbarSuccess("Classifications were successfully updated"));
  } catch (error) {}
};

export default editClassifications;
