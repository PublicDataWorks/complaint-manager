import React from "react";
import { connect } from "react-redux";
import { openArchiveCaseDialog } from "../../../actionCreators/casesActionCreators";
import LinkButton from "../../../shared/components/LinkButton";
import ArchiveCaseDialog from "../ArchiveCaseDialog/ArchiveCaseDialog";

const ArchiveCaseButton = ({ openArchiveCaseDialog }) => {
  return (
    <div>
      <LinkButton
        onClick={openArchiveCaseDialog}
        style={{ textAlign: "right", marginBottom: "16px" }}
        data-testid="archiveCaseButton"
      >
        Archive Case
      </LinkButton>
      <ArchiveCaseDialog />
    </div>
  );
};

const mapDispatchToProps = {
  openArchiveCaseDialog
};

export default connect(null, mapDispatchToProps)(ArchiveCaseButton);
