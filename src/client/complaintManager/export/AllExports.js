import React, { Component } from "react";
import {
  clearCurrentExportJob,
  closeExportConfirmationDialog,
  openExportAuditLogConfirmationDialog
} from "../actionCreators/exportActionCreators";
import ExportConfirmationDialog from "./ExportConfirmationDialog";
import { connect } from "react-redux";
import JobDetails from "./JobDetails";
import ExportAuditLogForm from "./ExportAuditLogForm";
import ExportCasesForm from "./ExportCasesForm";

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

  render() {
    return (
      <div>
        <div style={margin}>
          <div data-testid="ExportAllCasesContainer" style={margin}>
            <ExportCasesForm />
            <ExportAuditLogForm />
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
  closeExportConfirmationDialog,
  clearCurrentExportJob
};

export default connect(mapStateToProps, mapDispatchToProps)(AllExports);
