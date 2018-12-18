import config from "../../config/config";
import {
  getAllegationsFailed,
  getAllegationsSuccess
} from "../../actionCreators/allegationsActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getAllegationDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`${hostname}/api/allegations`);
    return dispatch(getAllegationsSuccess(response.data));
  } catch (e) {
    return dispatch(getAllegationsFailed());
  }
};

export default getAllegationDropdownValues;
