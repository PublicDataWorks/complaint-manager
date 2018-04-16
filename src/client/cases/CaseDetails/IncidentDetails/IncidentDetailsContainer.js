import IncidentDetails from "./IncidentDetails";
import {connect} from "react-redux";

const mapStateToProps = state => ({
    firstContactDate: state.currentCase.firstContactDate,
    incidentDate: state.currentCase.incidentDate,
    incidentTime: state.currentCase.incidentTime,
    incidentLocation: state.currentCase.incidentLocation,
    caseId: state.currentCase.id
})

export default connect(mapStateToProps)(IncidentDetails)