import React, { Component } from "react";
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
import {
  PrimaryButton,
  SecondaryButton
} from "../shared/components/StyledButtons";
import { Typography } from "@material-ui/core";

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

  renderAuditLogOptionDateRangeExportFeatureOff = () => {
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
  renderExportAuditLogOption = dateRangeExportFeature => {
    if (
      !this.props.permissions ||
      !this.props.permissions.includes(USER_PERMISSIONS.EXPORT_AUDIT_LOG)
    ) {
      return null;
    }
    if (!dateRangeExportFeature) {
      this.renderAuditLogOptionDateRangeExportFeatureOff();
    } else {
      return (
        <div>
          <div style={{ margin: "0 0 32px 0" }}>
            <Typography variant="title" style={{ marginRight: "20px" }}>
              Export Audit Log
            </Typography>
            <Typography variant="body1" color="inherit">
              Select a date range to export an audit log of Complaint Manager
              activities within that range or export a full audit log.
            </Typography>
          </div>
          <PrimaryButton style={{ marginRight: "20px" }}>
            Export Selected Audit Log
          </PrimaryButton>
          <SecondaryButton
            data-test={"exportAuditLog"}
            disabled={this.props.buttonsDisabled}
            onClick={() => {
              this.props.openExportAuditLogConfirmationDialog();
            }}
          >
            Export Full Audit Log
          </SecondaryButton>
        </div>
      );
    }
  };

  render() {
    const dateRangeExportFeature = this.props.dateRangeExportFeature;
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
            {this.renderExportAuditLogOption(dateRangeExportFeature)}
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
  permissions: state.users.current.userInfo.permissions,
  dateRangeExportFeature: state.featureToggles.dateRangeExportFeature
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
