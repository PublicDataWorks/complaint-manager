import axios from "axios";
import { getOfficerHistoryOptionsRadioButtonValuesSuccess } from "../../../actionCreators/officerHistoryOptionsActionCreator";

const getOfficerHistoryOptionsRadioButtonValues = () => async dispatch => {
  try {
    const response = await axios.get("api/officer-history-options");
    return dispatch(
      getOfficerHistoryOptionsRadioButtonValuesSuccess(response.data)
    );
  } catch (error) {}
};

export default getOfficerHistoryOptionsRadioButtonValues;
