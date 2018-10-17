import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { SecondaryButton, PrimaryButton } from "../shared/components/StyledButtons";
import { connect } from "react-redux";
import { closeExportConfirmationDialog } from "../actionCreators/navBarActionCreators";
import generateExportJob from "./thunks/generateExportJob";

const ExportConfirmationDialog = props => {
  const closeDialog = () => {
    props.dispatch(closeExportConfirmationDialog());
  };

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={props.open}>
      <DialogTitle>Export {props.title}</DialogTitle>
      <DialogContent data-test="exportAuditLogConfirmationText">
        <Typography
          variant={"body1"}
          style={{ wordBreak: "break-word", marginBottom: "16px" }}
        >
          This action will export {props.warningText} the system as a .csv file.
          This file will download automatically and may take a few seconds to
          generate.
        </Typography>
        <Typography variant={"body1"} style={{ wordBreak: "break-word" }}>
          Are you sure you wish to continue?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={closeDialog}>Cancel</SecondaryButton>
        <PrimaryButton
          data-test="exportAuditLogButton"
          onClick={() => {
            props.dispatch(generateExportJob(props.path));
            closeDialog();
          }}
        >
          Export
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  open: state.ui.exportDialog.open,
  path: state.ui.exportDialog.path,
  title: state.ui.exportDialog.title,
  warningText: state.ui.exportDialog.warningText
});
export default connect(mapStateToProps)(ExportConfirmationDialog);
