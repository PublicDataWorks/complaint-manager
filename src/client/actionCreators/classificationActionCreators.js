import { GET_CLASSIFICATIONS_SUCCEEDED } from "../../sharedUtilities/constants";

export const getClassificationsSuccess = classifications => ({
  type: GET_CLASSIFICATIONS_SUCCEEDED,
  classifications
});
