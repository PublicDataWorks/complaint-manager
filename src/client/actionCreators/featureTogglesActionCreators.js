import { GET_FEATURES_SUCCEEDED } from "../../sharedUtilities/constants";

export const getFeaturesSuccess = features => ({
  type: GET_FEATURES_SUCCEEDED,
  features
});
