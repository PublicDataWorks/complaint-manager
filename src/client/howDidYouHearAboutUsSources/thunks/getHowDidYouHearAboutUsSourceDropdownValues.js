import axios from "axios";
import { getHowDidYouHearAboutUsSourcesSuccess } from "../../actionCreators/howDidYouHearAboutUsSourceActionCreators";

const getHowDidYouHearAboutUsSourceDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/how-did-you-hear-about-us-sources`);
    return dispatch(getHowDidYouHearAboutUsSourcesSuccess(response.data));
  } catch (error) {}
};

export default getHowDidYouHearAboutUsSourceDropdownValues;
