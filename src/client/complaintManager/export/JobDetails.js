import React, { Component } from "react";
import { connect } from "react-redux";
import getExportJob from "./thunks/getExportJob";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReactDOM from "react-dom";
import { clearCurrentExportJob } from "../actionCreators/exportActionCreators";

export class JobDetails extends Component {
  componentDidMount() {
    this.classes = this.props;
    this.props.getExportJob(this.props.jobId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.downloadUrl) {
      this.triggerDownload();
      this.props.clearCurrentExportJob();
    }
  }

  triggerDownload() {
    const anchorNode = ReactDOM.findDOMNode(this);
    anchorNode.click();
  }

  render() {
    return this.props.downloadUrl ? (
      <a
        data-testid="downloadUrl"
        type="application/octet-stream"
        href={this.props.downloadUrl}
      >
        {}
      </a>
    ) : (
      <div
        data-testid="waitingForJob"
        style={{
          textAlign: "center",
          alignItems: "center",
          justify: "center",
          margin: "24px"
        }}
      >
        <CircularProgress
          style={{ display: this.props.showProgress ? "" : "none" }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  downloadUrl: state.export.downloadUrl,
  showProgress: state.ui.allExports.showProgress
});

const mapDispatchToProps = {
  getExportJob,
  clearCurrentExportJob
};

export default connect(mapStateToProps, mapDispatchToProps)(JobDetails);
