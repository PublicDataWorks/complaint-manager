import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { SecondaryButton, PrimaryButton } from "../StyledButtons";
import timezone from "moment-timezone";
import { TIMEZONE } from "../../../../sharedUtilities/constants";
import downloader from "../../../cases/thunks/downloader";
import { connect } from "react-redux";

const ExportAuditLogConfirmationDialog = props => {
  const path = "/api/export-audit-log";
  const date = timezone()
    .tz(TIMEZONE)
    .format("YYYY-MM-DD_HH.MM.ss.zz");
  const fileName = `Complaint_Manager_Audit_Log_${date}.csv`;

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={props.dialogOpen}>
      <DialogTitle>Export Audit Log</DialogTitle>
      <DialogContent data-test="exportAuditLogConfirmationText">
        <Typography
          variant={"body1"}
          style={{ wordBreak: "break-word", marginBottom: "16px" }}
        >
          This action will export a log of all actions taken within the system
          as a .csv file. This file will download automatically and may take a
          few seconds to generate.
        </Typography>
        <Typography variant={"body1"} style={{ wordBreak: "break-word" }}>
          Are you sure you wish to continue?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={props.handleClose}>Cancel</SecondaryButton>
        <PrimaryButton
          data-test="exportAuditLogButton"
          onClick={() =>
            props.dispatch(downloader(path, fileName, true, props.handleClose))
          }
        >
          Export
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default connect()(ExportAuditLogConfirmationDialog);
