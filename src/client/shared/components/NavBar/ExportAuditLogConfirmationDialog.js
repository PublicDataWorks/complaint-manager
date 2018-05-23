import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "material-ui";
import { SecondaryButton, PrimaryButton } from "../StyledButtons";
import moment from "moment";
import downloader from "../../../cases/thunks/downloader";
import { connect } from "react-redux";

const ExportAuditLogConfirmationDialog = props => {
  const path = "/api/export-audit-log";
  const date = moment().format("MM-DD-YYYY");
  const fileName = `Complaint_Manager_System_Log_${date}.csv`;

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={props.dialogOpen}>
      <DialogTitle>Export System Log</DialogTitle>
      <DialogContent>
        <Typography
          data-test="exportAuditLogConfirmationText"
          variant={"body1"}
          style={{ wordBreak: "break-word" }}
        >
          Your export will be saved as <strong>{fileName}</strong>
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={props.handleClose}>Cancel</SecondaryButton>
        <PrimaryButton
          data-test="exportAuditLogButton"
          onClick={() =>
            props.dispatch(downloader(path, fileName, props.handleClose))
          }
        >
          Export
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default connect()(ExportAuditLogConfirmationDialog);
