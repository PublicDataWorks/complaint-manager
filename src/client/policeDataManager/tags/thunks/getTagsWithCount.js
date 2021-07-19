import { getTagsSuccess } from "../../actionCreators/tagActionCreators";
import axios from "axios";

const getTagsWithCount = () => async dispatch => {
  try {
    const response = await axios.get(`api/tags?expand=count`);
    return dispatch(getTagsSuccess(response.data));
  } catch (error) {}
};

export default getTagsWithCount;
