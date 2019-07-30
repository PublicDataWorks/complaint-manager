import { getCivilianTitlesSuccess } from "../../actionCreators/civilianTitleActionCreators";
import axios from "axios";

const getCivilianTitleDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/civilian-titles`);
    return dispatch(getCivilianTitlesSuccess(response.data));
  } catch (error) {}
};

export default getCivilianTitleDropdownValues;
