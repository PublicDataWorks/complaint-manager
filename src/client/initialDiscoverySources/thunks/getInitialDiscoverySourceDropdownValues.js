import axios from "axios";
import { getInitialDiscoverySourcesSuccess } from "../../actionCreators/initialDiscoverySourceActionCreators";

const getInitialDiscoverySourceDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/initial-discovery-sources`);
    return dispatch(getInitialDiscoverySourcesSuccess(response.data));
  } catch (error) {}
};

export default getInitialDiscoverySourceDropdownValues;
