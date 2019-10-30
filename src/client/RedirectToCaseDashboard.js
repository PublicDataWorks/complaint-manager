import React from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { snackbarError } from "./complaintManager/actionCreators/snackBarActionCreators";

class RedirectToCaseDashboard extends React.Component {
  componentDidMount() {
    const caseId = this.props.match.params.id;
    if (!caseId) {
      this.props.redirectBackToHome();
    } else {
      this.props.redirectToCaseDetailsPage(caseId);
    }
  }

  render() {
    return null;
  }
}

const redirectBackToHome = () => dispatch => {
  dispatch(push("/"));
  dispatch(snackbarError("Sorry, that page is not available"));
};

const redirectToCaseDetailsPage = caseId => dispatch => {
  dispatch(push(`/cases/${caseId}`));
  dispatch(snackbarError("Sorry, that page is not available"));
};

const mapDispatchToProps = {
  redirectBackToHome,
  redirectToCaseDetailsPage
};

export default connect(
  null,
  mapDispatchToProps
)(RedirectToCaseDashboard);
