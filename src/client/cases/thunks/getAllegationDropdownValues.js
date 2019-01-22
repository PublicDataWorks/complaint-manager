import { getAllegationsSuccess } from "../../actionCreators/allegationsActionCreators";
import axios from "axios";

const getAllegationDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/allegations`);
    return dispatch(getAllegationsSuccess(response.data));
  } catch (e) {}
};

export default getAllegationDropdownValues;
