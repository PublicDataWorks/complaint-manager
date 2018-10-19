import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import LinkButton from "../shared/components/LinkButton";
import {
  clearCurrentExportJob,
  closeExportConfirmationDialog,
  openExportAllCasesConfirmationDialog,
  openExportAuditLogConfirmationDialog
} from "../actionCreators/exportActionCreators";
import ExportConfirmationDialog from "./ExportConfirmationDialog";
import { connect } from "react-redux";
import JobDetails from "./JobDetails";
import { USER_PERMISSIONS } from "../../sharedUtilities/constants";

const margin = {
  marginLeft: "36px",
  marginTop: "36px",
  marginBottom: "16px"
};

class AllExports extends Component {
  componentDidMount() {
    // Need to clear the export job state, in case of leaving the page while still waiting for a job to complete
    // the pulling of the job using setTimeout can still trigger and set a completed job download url after leaving the page
    // need to clear before mounting to prevent the JobDetail component from mounting till we get a new JobId
    this.props.clearCurrentExportJob();
  }

  componentWillUnmount() {
    // Need to clear export state in case of leaving while still waiting for job to be completed
    // setting jobId to null at the time of un-mounting, will prevent another call to getExportJob that will return an
    // old completed job (with an old jobId) that will set the downloadUrl
    // which prevent waiting spinner to show while another job is running.
    this.props.clearCurrentExportJob();
  }

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
        disabled={this.props.buttonsDisabled}
        onClick={() => {
          this.props.openExportAuditLogConfirmationDialog();
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
          <div data-test="ExportAllCasesContainer" style={margin}>
            <LinkButton
              data-test="openExportConfirmationDialog"
              disabled={this.props.buttonsDisabled}
              onClick={() => {
                this.props.openExportAllCasesConfirmationDialog();
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
  buttonsDisabled: state.ui.allExports.buttonsDisabled,
  permissions: state.users.current.userInfo.permissions
});

const mapDispatchToProps = {
  openExportAuditLogConfirmationDialog,
  openExportAllCasesConfirmationDialog,
  closeExportConfirmationDialog,
  clearCurrentExportJob
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllExports);
