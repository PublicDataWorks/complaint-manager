import React, { Component } from "react";
import {Typography} from "@material-ui/core";
import LinkButton from "../shared/components/LinkButton";
import {
  openExportAllCasesConfirmationDialog,
  closeExportConfirmationDialog
} from "../actionCreators/navBarActionCreators";
import ExportConfirmationDialog from "../shared/components/NavBar/ExportConfirmationDialog";
import connect from "react-redux/es/connect/connect";
import _ from "lodash";
import JobDetails from "./jobDetails";
import getExportJobs from "./thunks/getExportJobs";

import { bindActionCreators } from 'redux'


class ExportAllCases extends Component {
  componentDidMount() {
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
              onClick={ () => {
                  this.props.openExportAllCasesConfirmationDialog();
                }
              }
            >
              Export All Cases
            </LinkButton>
          </div>
        </div>
        <div>
          <p> Found jobs {this.props.exportJobs ? this.props.exportJobs.length : 0} </p>
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
  exportJobs: state.export.exportJobs
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators( { getExportJobs, openExportAllCasesConfirmationDialog, closeExportConfirmationDialog }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportAllCases);
