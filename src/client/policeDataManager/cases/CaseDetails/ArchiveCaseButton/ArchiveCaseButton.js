import React from "react";
import LinkButton from "../../../shared/components/LinkButton";
import ArchiveCaseDialog from "../ArchiveCaseDialog/ArchiveCaseDialog";
import { useState } from "react";

const ArchiveCaseButton = () => {
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
      <ArchiveCaseDialog
        dialogOpen={dialogOpen}
        closeDialog={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default ArchiveCaseButton;
