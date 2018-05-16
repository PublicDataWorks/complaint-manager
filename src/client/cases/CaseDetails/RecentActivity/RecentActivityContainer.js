import { connect } from "react-redux";
import RecentActivity from "./RecentActivity";

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  recentActivity: state.currentCase.recentActivity
});

export default connect(mapStateToProps)(RecentActivity);
