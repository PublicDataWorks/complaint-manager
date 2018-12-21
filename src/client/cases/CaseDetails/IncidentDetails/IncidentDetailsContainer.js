import IncidentDetails from "./IncidentDetails";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  firstContactDate: state.currentCase.details.firstContactDate,
  incidentDate: state.currentCase.details.incidentDate,
  incidentTime: state.currentCase.details.incidentTime,
  incidentLocation: state.currentCase.details.incidentLocation,
  district: state.currentCase.details.district,
  caseId: state.currentCase.details.id,
  classificationId: state.currentCase.details.classificationId,
  classification: state.currentCase.details.classification,
  intakeSourceId: state.currentCase.details.intakeSourceId,
  intakeSource: state.currentCase.details.intakeSource
});

export default connect(mapStateToProps)(IncidentDetails);
