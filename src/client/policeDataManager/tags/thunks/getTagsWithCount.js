import { getTagsSuccess } from "../../actionCreators/tagActionCreators";
import axios from "axios";

const getTagsWithCount = (sortBy, sortDirection) => async dispatch => {
  let url = "api/tags?expand=count";
  if (sortDirection && sortBy) {
    url += `&sort=${sortDirection}.${sortBy}`;
  } else if (sortBy) {
    url += `&sort=${sortBy}`;
  }

  try {
    const response = await axios.get(url);
    return dispatch(getTagsSuccess(response.data));
  } catch (error) {}
};

export default getTagsWithCount;
