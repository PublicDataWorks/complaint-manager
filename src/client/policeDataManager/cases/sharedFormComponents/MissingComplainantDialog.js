import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import { closeMissingComplainantDialog } from "../../actionCreators/letterActionCreators";
import { connect } from "react-redux";
import { push } from "connected-react-router";

const MissingComplainantDialog = ({
  open,
  caseId,
  closeMissingComplainantDialog,
  redirectBackToCaseDetails
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle data-testid="missing-complainant-title">
        Missing Complainant Information
      </DialogTitle>
      <DialogContent>
        <Typography style={{ marginBottom: "24px" }} data-testid="dialogText">
          In order to submit your letter, you must add a{" "}
          <strong>Complainant</strong>. Please add at least one complainant to
          this case.
        </Typography>
      </DialogContent>
      <DialogActions>
        <PrimaryButton
          data-testid="close-missing-complainant-dialog"
          onClick={() => {
            closeMissingComplainantDialog();
            redirectBackToCaseDetails(caseId);
          }}
        >
          Return
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const redirectBackToCaseDetails = caseId => dispatch => {
  dispatch(
    push({
      pathname: `/cases/${caseId}`,
      state: {
        caseId: caseId
      }
    })
  );
};

const mapDispatchToProps = {
  closeMissingComplainantDialog,
  redirectBackToCaseDetails
};

const mapStateToProps = state => ({
  open: state.ui.openMissingComplainantDialog.open
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MissingComplainantDialog);
