import { getTagsSuccess } from "../../actionCreators/tagActionCreators";
import axios from "axios";

const getTagDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/tags`);
    return dispatch(getTagsSuccess(response.data));
  } catch (error) {}
};

export default getTagDropdownValues;
