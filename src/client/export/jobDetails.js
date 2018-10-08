import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import getExportJob from "./thunks/getExportJob";
import ReactDOM from "react-dom";

class JobDetails extends Component {
  componentDidMount() {
    this.props.dispatch(getExportJob(this.props.jobId));
    setTimeout(this.refreshJob, 1000);
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).click();
  }

  refreshJob = () => {
    if (!(this.props.exportJob && this.props.exportJob.state === "complete")) {
      this.props.dispatch(getExportJob(this.props.jobId));
      setTimeout(this.refreshJob, 1000);
    }
  };

  render() {
    return this.props.exportJob && this.props.exportJob.state === "complete" ? (
      <a href={this.props.exportJob.result.downLoadUrl} />
    ) : (
      <p> Waiting </p>
    );
  }
}

const mapStateToProps = state => ({
  exportJob: state.export.exportJobs.exportJob
});

export default connect(mapStateToProps)(JobDetails);
