import axios from "axios";
import encodeUriWithQueryParams from "../../utilities/encodeUriWithQueryParams";
import { getHousingUnitsSuccess } from "../../actionCreators/housingUnitActionCreator";

const getHousingUnits = facilityId => async dispatch => {
  try {
    let url = `/api/housing-units`;
    url = encodeUriWithQueryParams(url, { facilityId });
    const response = await axios.get(url);
    dispatch(getHousingUnitsSuccess(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default getHousingUnits;
