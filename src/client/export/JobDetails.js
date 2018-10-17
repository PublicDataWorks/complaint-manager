import React, { Component } from "react";
import { connect } from "react-redux";
import getExportJob from "./thunks/getExportJob";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReactDOM from "react-dom";
import { addBackgroundJobFailure } from "../actionCreators/exportActionCreators";
import { bindActionCreators } from "redux";

const REFRESH_MS = 1000;
const MAX_REFRESH = 180;

let refreshes = 0;

class JobDetails extends Component {
  componentDidMount() {
    refreshes = 1;
    this.classes = this.props;
    this.props.getExportJob(this.props.jobId);
    setTimeout(this.refreshJob, REFRESH_MS);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.jobId !== this.props.jobId) {
      refreshes = 1;
      setTimeout(this.refreshJob, REFRESH_MS);
    } else {
      if (
        prevProps.exportJob &&
        prevProps.exportJob.state !== "complete" &&
        this.jobCompleted()
      ) {
        const anchorNode = ReactDOM.findDOMNode(this);
        anchorNode.click();
        anchorNode.href = "";
      }
    }
  }

  jobCompleted() {
    return this.props.exportJob && this.props.exportJob.state === "complete";
  }

  jobFailed() {
    return this.props.exportJob && this.props.exportJob.state === "failed";
  }

  refreshJob = () => {
    refreshes = refreshes + 1;
    if (this.jobFailed() || refreshes > MAX_REFRESH) {
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
        type="application/octet-stream"
        href={this.props.exportJob.downLoadUrl}
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
