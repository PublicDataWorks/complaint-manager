import IncidentDetails from "./IncidentDetails";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  firstContactDate: state.currentCase.details.firstContactDate,
  incidentDate: state.currentCase.details.incidentDate,
  incidentTime: state.currentCase.details.incidentTime,
  incidentLocation: state.currentCase.details.incidentLocation,
  district: state.currentCase.details.district,
  caseId: state.currentCase.details.id,
  classificationId: state.currentCase.details.classificationId
});

export default connect(mapStateToProps)(IncidentDetails);
