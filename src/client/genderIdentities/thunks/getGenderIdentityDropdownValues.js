import { getGenderIdentitiesSuccess } from "../../actionCreators/genderIdentityActionCreators";
import axios from "axios";

const getGenderIdentityDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/gender-identities`);
    return dispatch(getGenderIdentitiesSuccess(response.data));
  } catch (error) {}
};

export default getGenderIdentityDropdownValues;
