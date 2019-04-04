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
  RANK_INITIATED
} from "../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import getWorkingCases from "./getWorkingCases";

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
    if (creationDetails.redirect) {
      if (creationDetails.caseDetails.case.complaintType === RANK_INITIATED) {
        dispatch(push(`/cases/${response.data.id}/officers/search`));
      } else if (
        creationDetails.caseDetails.case.complaintType === CIVILIAN_INITIATED
      ) {
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
