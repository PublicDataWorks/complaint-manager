import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import getExportJob from "./thunks/getExportJob";

class JobDetails extends Component {
  componentDidMount() {
    this.props.dispatch(getExportJob(this.props.jobId));
    setTimeout(this.refreshJob, 1000);
  }

  refreshJob = () => {
    if (!(this.props.exportJob && this.props.exportJob.state === "complete")) {
      this.props.dispatch(getExportJob(this.props.jobId));
      setTimeout(this.refreshJob, 1000);
    }
  };

  render() {
    return this.props.exportJob && this.props.exportJob.state === "complete" ? (
      <p> Job location {this.props.exportJob.result.Location} </p>
    ) : (
      <p> Waiting </p>
    );
  }
}

const mapStateToProps = state => ({
  exportJob: state.export.exportJobs.exportJob
});

export default connect(mapStateToProps)(JobDetails);
