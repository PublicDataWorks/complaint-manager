import {
  ADD_OFFICER_ALLEGATION_SUCCEEDED,
  GET_ALLEGATIONS_FAILED,
  GET_ALLEGATIONS_SUCCEEDED
} from "../../sharedUtilities/constants";

export const getAllegationsSuccess = allegations => ({
  type: GET_ALLEGATIONS_SUCCEEDED,
  allegations
});

export const getAllegationsFailed = () => ({
  type: GET_ALLEGATIONS_FAILED
});

export const createOfficerAllegationSuccess = caseDetails => ({
  type: ADD_OFFICER_ALLEGATION_SUCCEEDED,
  caseDetails
});
