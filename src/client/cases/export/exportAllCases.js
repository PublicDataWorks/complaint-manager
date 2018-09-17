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

class ExportAllCases extends Component {
  componentDidMount() {
    this.props.dispatch(closeSnackbar());
    this.props.dispatch(closeExportConfirmationDialog());
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
        <ExportConfirmationDialog />
      </div>
    );
  }
}

export default connect()(ExportAllCases);
