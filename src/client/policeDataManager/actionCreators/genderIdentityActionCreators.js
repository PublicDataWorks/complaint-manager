import { GET_GENDER_IDENTITIES_SUCCEEDED } from "../../../sharedUtilities/constants";

export const getGenderIdentitiesSuccess = genderIdentities => {
  return {
    type: GET_GENDER_IDENTITIES_SUCCEEDED,
    genderIdentities
  };
};
