import { createCaseSuccess } from "../../actionCreators/casesActionCreators";
import { initialize, reset, startSubmit, stopSubmit } from "redux-form";
import { push } from "connected-react-router";
import axios from "axios";
import {
  COMPLAINANT,
  OFFICER_DETAILS_FORM_NAME,
  CREATE_CASE_FORM_NAME,
  SHOW_FORM
} from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import getWorkingCases from "./getWorkingCases";
import { addCaseEmployeeType } from "../../actionCreators/officersActionCreators";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";

const createCase = creationDetails => async dispatch => {
  dispatch(startSubmit(CREATE_CASE_FORM_NAME));
  try {
    const response = await axios.post(`api/cases`, creationDetails.caseDetails);
    dispatch(snackbarSuccess("Case was successfully created"));
    dispatch(createCaseSuccess(response.data));
    dispatch(closeCreateDialog(DialogTypes.CASE));

    if (creationDetails.redirect) {
      if (creationDetails.personType.dialogAction === SHOW_FORM) {
        dispatch(push(`/cases/${response.data.id}`));
      } else {
        dispatch(
          addCaseEmployeeType(
            creationDetails.personType.isEmployee
              ? creationDetails.personType.employeeDescription
              : creationDetails.personType.description
          )
        );
        dispatch(
          initialize(OFFICER_DETAILS_FORM_NAME, {
            roleOnCase: COMPLAINANT
          })
        );
        dispatch(
          push(
            `/cases/${response.data.id}${creationDetails.personType.dialogAction}`
          )
        );
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
