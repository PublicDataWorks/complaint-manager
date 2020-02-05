import React, { Component } from "react";
import { connect } from "react-redux";
import { openRestoreArchivedCaseDialog } from "../../../actionCreators/casesActionCreators";
import LinkButton from "../../../shared/components/LinkButton";
import RestoreArchivedCaseDialog from "../RestoreArchivedCaseDialog/RestoreArchivedCaseDialog";

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
        <RestoreArchivedCaseDialog />
      </div>
    );
  }
}

const mapDispatchToProps = {
  openRestoreArchivedCaseDialog
};

export default connect(null, mapDispatchToProps)(RestoreArchivedCaseButton);
