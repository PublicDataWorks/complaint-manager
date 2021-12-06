import React, { lazy, Suspense } from "react";
import { connect } from "react-redux";
import { openArchiveCaseDialog } from "../../../actionCreators/casesActionCreators";
import LinkButton from "../../../shared/components/LinkButton";
const ArchiveCaseDialog = lazy(() =>
  import("../ArchiveCaseDialog/ArchiveCaseDialog")
);

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
      <Suspense
        fallback={() => <CircularProgress data-testid="spinner" size={30} />}
      >
        <ArchiveCaseDialog />
      </Suspense>
    </div>
  );
};

const mapDispatchToProps = {
  openArchiveCaseDialog
};

export default connect(null, mapDispatchToProps)(ArchiveCaseButton);
