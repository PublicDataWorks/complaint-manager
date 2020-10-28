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
import formatDate from "../../../sharedUtilities/formatDate";
import { CASE_EXPORT_TYPE } from "../../../sharedUtilities/constants";

const dateRangeText = dateRange => {
  let dateRangeType = "";
  if (dateRange) {
    if (dateRange.type === CASE_EXPORT_TYPE.INCIDENT_DATE) {
      dateRangeType = " with an incident date";
    } else if (dateRange.type === CASE_EXPORT_TYPE.FIRST_CONTACT_DATE) {
      dateRangeType = " with a first contact date";
    }
    return (
      <strong>
        {`${dateRangeType} between ${formatDate(
          dateRange.exportStartDate
        )} and ${formatDate(dateRange.exportEndDate)} `}
      </strong>
    );
  } else {
    return " ";
  }
};

const ExportConfirmationDialog = props => {
  const startExportJob = () => {
    props.generateExportJob(props.path, props.dateRange);
    props.exportJobStarted();
    props.closeExportConfirmationDialog();
  };

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={props.open}>
      <DialogTitle>Export {props.title}</DialogTitle>
      <DialogContent data-testid="exportConfirmationText">
        <Typography
          variant={"body2"}
          style={{ wordBreak: "break-word", marginBottom: "16px" }}
        >
          This action will export {props.warningText} the system
          {dateRangeText(props.dateRange)}as a .csv file. This file will
          download automatically and may take a few seconds to generate.
        </Typography>
        <Typography variant={"body2"} style={{ wordBreak: "break-word" }}>
          Are you sure you wish to continue?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={props.closeExportConfirmationDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-testid="exportAuditLogButton"
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
