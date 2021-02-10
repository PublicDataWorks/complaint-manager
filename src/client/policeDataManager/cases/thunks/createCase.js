import { createCaseSuccess } from "../../actionCreators/casesActionCreators";
import { initialize, reset, startSubmit, stopSubmit } from "redux-form";
import { push } from "connected-react-router";
import axios from "axios";
import {
  CIVILIAN_INITIATED,
  EMPLOYEE_TYPE,
  COMPLAINANT,
  OFFICER_DETAILS_FORM_NAME,
  RANK_INITIATED,
  CREATE_CASE_FORM_NAME
} from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import getWorkingCases from "./getWorkingCases";
import { addCaseEmployeeType } from "../../actionCreators/officersActionCreators";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";

const createCase = creationDetails => async dispatch => {
  dispatch(startSubmit(CREATE_CASE_FORM_NAME));
  try {
    const response = await axios.post(
      `api/cases`,
      JSON.stringify(creationDetails.caseDetails)
    );
    dispatch(snackbarSuccess("Case was successfully created"));
    dispatch(createCaseSuccess(response.data));
    dispatch(closeCreateDialog(DialogTypes.CASE));

    const complaintType = creationDetails.caseDetails.case.complaintType;
    if (creationDetails.redirect) {
      if (complaintType === CIVILIAN_INITIATED) {
        dispatch(push(`/cases/${response.data.id}`));
      } else {
        dispatch(
          addCaseEmployeeType(
            complaintType === RANK_INITIATED
              ? EMPLOYEE_TYPE.OFFICER
              : EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD
          )
        );
        dispatch(
          initialize(OFFICER_DETAILS_FORM_NAME, {
            roleOnCase: COMPLAINANT
          })
        );
        dispatch(push(`/cases/${response.data.id}/officers/search`));
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
    return dispatch(reset(CREATE_CASE_FORM_NAME));
  } catch (e) {
  } finally {
    dispatch(stopSubmit(CREATE_CASE_FORM_NAME));
  }
};

export default createCase;
