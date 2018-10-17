import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import LinkButton from "../shared/components/LinkButton";
import {
  openExportAuditLogConfirmationDialog,
  openExportAllCasesConfirmationDialog,
  closeExportConfirmationDialog,
  clearCurrentExportJob
} from "../actionCreators/navBarActionCreators";
import ExportConfirmationDialog from "./ExportConfirmationDialog";
import { connect } from "react-redux";
import JobDetails from "./JobDetails";
import { bindActionCreators } from "redux";
import { USER_PERMISSIONS } from "../../sharedUtilities/constants";

const margin = {
  marginLeft: "36px",
  marginTop: "36px",
  marginBottom: "16px"
};

class AllExports extends Component {
  componentDidMount() {}

  renderExportAuditLogOption = () => {
    if (
      !this.props.permissions ||
      !this.props.permissions.includes(USER_PERMISSIONS.EXPORT_AUDIT_LOG)
    ) {
      return null;
    }
    return (
      <LinkButton
        data-test="exportAuditLog"
        onClick={() => {
          this.props.openExportAuditLogConfirmationDialog();
          this.props.clearCurrentExportJob();
        }}
      >
        Export Audit Log
      </LinkButton>
    );
  };

  render() {
    return (
      <div>
        <div style={margin}>
          <div style={margin}>
            <Typography
              variant={"title"}
              style={{
                marginBottom: "16px",
                flex: 1
              }}
            >
              Export
            </Typography>
          </div>
          <div data-test="ExportAllCasesContainer" style={margin}>
            <LinkButton
              data-test="openExportConfirmationDialog"
              onClick={() => {
                this.props.openExportAllCasesConfirmationDialog();
                this.props.clearCurrentExportJob();
              }}
            >
              Export All Cases
            </LinkButton>
            {this.renderExportAuditLogOption()}
          </div>
        </div>
        <div style={margin}>
          {this.props.jobId ? (
            <JobDetails jobId={this.props.jobId} key={this.props.jobId} />
          ) : null}
        </div>
        <ExportConfirmationDialog />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jobId: state.export.generateJob.jobId,
  permissions: state.users.current.userInfo.permissions
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      openExportAuditLogConfirmationDialog,
      openExportAllCasesConfirmationDialog,
      closeExportConfirmationDialog,
      clearCurrentExportJob
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllExports);
