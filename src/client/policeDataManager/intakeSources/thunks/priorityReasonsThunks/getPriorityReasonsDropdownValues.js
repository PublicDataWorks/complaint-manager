import axios from "axios";
import { getPriorityReasonsSuccess } from "../../../actionCreators/priorityReasonsActionCreators";

const getPriorityReasonsDropdownValues = () => async dispatch => {
    try {
        const response = await axios.get(`api/priority-reasons`);
        return dispatch(getPriorityReasonsSuccess(response.data));
    } catch (error) {}
    }

export default getPriorityReasonsDropdownValues;