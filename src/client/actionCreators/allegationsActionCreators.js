import {
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
