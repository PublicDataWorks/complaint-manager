import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import { connect } from "react-redux";
import archiveCase from "../../thunks/archiveCase";

const ArchiveCaseButton = ({ caseId, dispatch }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div>
      <LinkButton
        onClick={() => setDialogOpen(true)}
        style={{ textAlign: "right", marginBottom: "16px" }}
        data-testid="archiveCaseButton"
      >
        Archive Case
      </LinkButton>
      <ConfirmationDialog
        confirmText="Archive Case"
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => {
          dispatch(archiveCase(caseId));
          setDialogOpen(false);
        }}
        open={dialogOpen}
        title="Archive Case"
      >
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          This action will mark the case as <strong>Archived</strong>. You will
          be returned to the All Cases page and this case will no longer be
          accessible.
        </Typography>
        <Typography>
          Are you sure you want to <strong>Archive Case</strong>?
        </Typography>
      </ConfirmationDialog>
    </div>
  );
};

export default connect(state => ({
  caseId: state.currentCase.details.id
}))(ArchiveCaseButton);
