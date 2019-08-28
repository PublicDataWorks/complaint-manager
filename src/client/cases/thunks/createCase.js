import {
  closeCreateCaseDialog,
  createCaseSuccess,
  requestCaseCreation
} from "../../actionCreators/casesActionCreators";
import { reset } from "redux-form";
import { push } from "connected-react-router";
import axios from "axios";
import {
  CIVILIAN_INITIATED,
  CIVILIAN_WITHIN_NOPD_INITIATED,
  EMPLOYEE_TYPE,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import getWorkingCases from "./getWorkingCases";
import { addCaseEmployeeType } from "../../actionCreators/officersActionCreators";

const createCase = creationDetails => async dispatch => {
  dispatch(requestCaseCreation());
  try {
    const response = await axios.post(
      `api/cases`,
      JSON.stringify(creationDetails.caseDetails)
    );
    dispatch(snackbarSuccess("Case was successfully created"));
    dispatch(createCaseSuccess(response.data));
    dispatch(closeCreateCaseDialog());

    const complaintType = creationDetails.caseDetails.case.complaintType;
    if (creationDetails.redirect) {
      if (complaintType === RANK_INITIATED) {
        dispatch(addCaseEmployeeType(EMPLOYEE_TYPE.OFFICER));
        dispatch(push(`/cases/${response.data.id}/officers/search`));
      } else if (complaintType === CIVILIAN_WITHIN_NOPD_INITIATED) {
        dispatch(addCaseEmployeeType(EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD));
        dispatch(push(`/cases/${response.data.id}/officers/search`));
      } else if (complaintType === CIVILIAN_INITIATED) {
        dispatch(push(`/cases/${response.data.id}`));
      }
    } else {
      dispatch(
        getWorkingCases(
          creationDetails.sorting.sortBy,
          creationDetails.sorting.sortDirection,
          creationDetails.pagination.currentPage
        )
      );
    }
    return dispatch(reset("CreateCase"));
  } catch (e) {}
};

export default createCase;
