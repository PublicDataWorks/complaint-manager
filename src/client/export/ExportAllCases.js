import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import LinkButton from "../shared/components/LinkButton";
import {
  openExportAllCasesConfirmationDialog,
  closeExportConfirmationDialog
} from "../actionCreators/navBarActionCreators";
import ExportConfirmationDialog from "../shared/components/NavBar/ExportConfirmationDialog";
import { connect } from "react-redux";
import JobDetails from "./JobDetails";
import { bindActionCreators } from "redux";

const margin = {
  marginLeft: "36px",
  marginTop: "36px",
  marginBottom: "16px"
};

class ExportAllCases extends Component {
  componentDidMount() {}

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
              }}
            >
              Export All Cases
            </LinkButton>
          </div>
        </div>
        <div style={margin}>
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
