import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import LinkButton from "../shared/components/LinkButton";
import {
  openExportAllCasesConfirmationDialog,
  closeExportConfirmationDialog
} from "../actionCreators/navBarActionCreators";
import ExportConfirmationDialog from "../shared/components/NavBar/ExportConfirmationDialog";
import connect from "react-redux/es/connect/connect";
import JobDetails from "./jobDetails";

import { bindActionCreators } from "redux";

class ExportAllCases extends Component {
  componentDidMount() {}

  render() {
    console.log("job id: ", this.props.jobId);
    return (
      <div>
        <div style={{ margin: "0px 24px" }}>
          <div style={{ display: "flex" }}>
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
          <div
            data-test="ExportAllCasesContainer"
            style={{ paddingBottom: "16px" }}
          >
            <LinkButton
              onClick={() => {
                this.props.openExportAllCasesConfirmationDialog();
              }}
            >
              Export All Cases
            </LinkButton>
          </div>
        </div>
        <div>
          {this.props.jobId ? <JobDetails jobId={this.props.jobId} /> : null}
        </div>
        <ExportConfirmationDialog />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jobId: state.export.generateJob.jobId
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      openExportAllCasesConfirmationDialog,
      closeExportConfirmationDialog
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportAllCases);
