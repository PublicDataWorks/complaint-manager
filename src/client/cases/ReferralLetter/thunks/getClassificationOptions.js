import axios from "axios";
import { getClassificationsSuccess } from "../../../actionCreators/letterActionCreators";


const getClassificationOptions = () => async dispatch => {
  try {
    const response = await axios.get(`api/new-classifications`);
    return dispatch(getClassificationsSuccess(response.data));
  } catch(error) {}
};

export default getClassificationOptions;