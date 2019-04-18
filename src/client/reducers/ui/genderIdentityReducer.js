import { GET_GENDER_IDENTITIES_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const genderIdentityReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GENDER_IDENTITIES_SUCCEEDED:
      return action.genderIdentities;
    default:
      return state;
  }
};

export default genderIdentityReducer;
