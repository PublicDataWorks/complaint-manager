import axios from "axios";
import { getClassificationsSuccess } from "../../actionCreators/classificationActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getClassficationDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/classifications`);
    return dispatch(getClassificationsSuccess(response.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the classifications were not loaded. Please try again."
      )
    );
  }
};

export default getClassficationDropdownValues;
