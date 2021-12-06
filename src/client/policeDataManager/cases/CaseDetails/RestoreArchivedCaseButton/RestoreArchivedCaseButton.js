import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { openRestoreArchivedCaseDialog } from "../../../actionCreators/casesActionCreators";
import LinkButton from "../../../shared/components/LinkButton";
const RestoreArchivedCaseDialog = lazy(() =>
  import("../RestoreArchivedCaseDialog/RestoreArchivedCaseDialog")
);

class RestoreArchivedCaseButton extends Component {
  render() {
    return (
      <div>
        <LinkButton
          onClick={this.props.openRestoreArchivedCaseDialog}
          style={{ textAlign: "right", marginBottom: "16px" }}
          data-testid="restoreCaseButton"
        >
          Restore Case
        </LinkButton>
        <Suspense
          fallback={() => <CircularProgress data-testid="spinner" size={30} />}
        >
          <RestoreArchivedCaseDialog />
        </Suspense>
      </div>
    );
  }
}

const mapDispatchToProps = {
  openRestoreArchivedCaseDialog
};

export default connect(null, mapDispatchToProps)(RestoreArchivedCaseButton);
