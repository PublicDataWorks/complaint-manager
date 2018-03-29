import IncidentDetails from "./IncidentDetails";
import {connect} from "react-redux";
import formatDate, {timeFromDateString} from "../../../utilities/formatDate";

const mapStateToProps = state => ({
    firstContactDate: state.currentCase.firstContactDate,
    incidentDate: formatDate(state.currentCase.incidentDate),
    incidentTime: timeFromDateString(state.currentCase.incidentDate)
})

export default connect(mapStateToProps)(IncidentDetails)