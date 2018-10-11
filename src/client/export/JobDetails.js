import React, { Component } from "react";
import { connect } from "react-redux";
import getExportJob from "./thunks/getExportJob";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReactDOM from "react-dom";
import { addBackgroundJobFailure } from "../actionCreators/exportActionCreators";
import { bindActionCreators } from "redux";

const REFRESH_MS = 1000;

class JobDetails extends Component {
  componentDidMount() {
    this.classes = this.props;
    this.props.getExportJob(this.props.jobId);
    setTimeout(this.refreshJob, REFRESH_MS);
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).click();
  }

  jobCompleted() {
    return this.props.exportJob && this.props.exportJob.state === "complete";
  }

  jobFailed() {
    return this.props.exportJob && this.props.exportJob.state === "failed";
  }

  refreshJob = () => {
    if (this.jobFailed()) {
      this.props.addBackgroundJobFailure();
    } else {
      if (!this.jobCompleted()) {
        this.props.getExportJob(this.props.jobId);
        setTimeout(this.refreshJob, REFRESH_MS);
      }
    }
  };

  render() {
    return this.jobCompleted() ? (
      <a
        data-test="downloadUrl"
        href={
          this.props.exportJob.result
            ? this.props.exportJob.result.downLoadUrl
            : ""
        }
      />
    ) : (
      <div
        data-test="waitingForJob"
        style={{
          textAlign: "center",
          alignItems: "center",
          justify: "center",
          margin: "24px"
        }}
      >
        <CircularProgress
          className={this.props.progress}
          style={{ display: this.jobFailed() ? "none" : "" }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  exportJob: state.export.exportJobs.exportJob
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getExportJob,
      addBackgroundJobFailure
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobDetails);
