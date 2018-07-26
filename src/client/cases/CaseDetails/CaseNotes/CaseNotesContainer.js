import { connect } from "react-redux";
import CaseNotes from "./CaseNotes";

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  caseNotes: state.currentCase.caseNotes
});

export default connect(mapStateToProps)(CaseNotes);
