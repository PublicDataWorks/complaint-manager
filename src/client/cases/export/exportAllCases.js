import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import LinkButton from "../../shared/components/LinkButton";
import {
  openExportAllCasesConfirmationDialog,
  closeExportConfirmationDialog
} from "../../actionCreators/navBarActionCreators";
import ExportConfirmationDialog from "../../shared/components/NavBar/ExportConfirmationDialog";
import { closeSnackbar } from "../../actionCreators/snackBarActionCreators";
import connect from "react-redux/es/connect/connect";
import _ from "lodash";
import JobDetails from "./jobDetails";
import getExportJobs from "../thunks/getExportJobs";

class ExportAllCases extends Component {
  componentDidMount() {
    // this.props.dispatch(closeSnackbar());
    // this.props.dispatch(closeExportConfirmationDialog());
    this.props.getExportJobs();
  }

  render() {
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
                this.props.dispatch(openExportAllCasesConfirmationDialog());
              }}
            >
              Export All Cases
            </LinkButton>
          </div>
        </div>
        <div>
          <p> Found jobs {this.props.exportJobs.length} </p>
          {_.sortBy(this.props.exportJobs, "id").map(job => (
            <JobDetails key={job.id} job={job} />
          ))}
        </div>
        <ExportConfirmationDialog />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  exportJobs: state.exportJobs
});

const mapDispatchToProps = {
  getExportJobs
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportAllCases);
