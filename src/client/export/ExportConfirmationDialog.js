import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import {
  PrimaryButton,
  SecondaryButton
} from "../shared/components/StyledButtons";
import { connect } from "react-redux";
import generateExportJob from "./thunks/generateExportJob";
import {
  closeExportConfirmationDialog,
  exportJobStarted
} from "../actionCreators/exportActionCreators";

const dateRangeText = dateRange => {
  if (dateRange) {
    return ` between ${dateRange.startDate} and ${dateRange.endDate} `;
  } else {
    return " ";
  }
};

const ExportConfirmationDialog = props => {
  const startExportJob = () => {
    props.generateExportJob(props.path);
    props.exportJobStarted();
    props.closeExportConfirmationDialog();
  };

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={props.open}>
      <DialogTitle>Export {props.title}</DialogTitle>
      <DialogContent data-test="exportAuditLogConfirmationText">
        <Typography
          variant={"body1"}
          style={{ wordBreak: "break-word", marginBottom: "16px" }}
        >
          This action will export {props.warningText} the system
          {dateRangeText(props.dateRange)}as a .csv file. This file will
          download automatically and may take a few seconds to generate.
        </Typography>
        <Typography variant={"body1"} style={{ wordBreak: "break-word" }}>
          Are you sure you wish to continue?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={props.closeExportConfirmationDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="exportAuditLogButton"
          onClick={startExportJob}
        >
          Export
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = {
  generateExportJob,
  closeExportConfirmationDialog,
  exportJobStarted
};

const mapStateToProps = state => ({
  open: state.ui.exportDialog.open,
  path: state.ui.exportDialog.path,
  title: state.ui.exportDialog.title,
  warningText: state.ui.exportDialog.warningText,
  dateRange: state.ui.exportDialog.dateRange
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportConfirmationDialog);
