import React from "react";
import { connect } from "react-redux";
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
import removeOfficerAllegation from "../cases/thunks/removeOfficerAllegation";
import { closeRemoveOfficerAllegationDialog } from "../actionCreators/allegationsActionCreators";
import TextTruncate from "../shared/components/TextTruncate";

const RemoveOfficerAllegationDialog = ({
  open,
  officerAllegation,
  officerName,
  dispatch
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Remove Allegation</DialogTitle>
      <DialogContent>
        <Typography
          data-test="removeAllegationPrompt"
          style={{
            marginBottom: "24px"
          }}
        >
          This action will remove the following allegation from{" "}
          <strong>{officerName}</strong>:
        </Typography>
        {officerAllegation.allegation && (
          <div
            data-test="allegationToRemove"
            style={{
              marginBottom: "24px",
              marginLeft: "24px",
              borderLeft: "solid lightgrey 4px",
              paddingLeft: "8px"
            }}
          >
            <Typography>{officerAllegation.allegation.rule}</Typography>
            <Typography>{officerAllegation.allegation.paragraph}</Typography>
            <Typography>
              {officerAllegation.allegation.directive
                ? officerAllegation.allegation.directive
                : "N/A"}
            </Typography>
            <br />
            <Typography>Severity: {officerAllegation.severity}</Typography>
            <br />
            <TextTruncate message={officerAllegation.details} />
          </div>
        )}
        <Typography>Are you sure you want to continue?</Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          data-test="cancelRemoveAllegationButton"
          onClick={() => dispatch(closeRemoveOfficerAllegationDialog())}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="removeOfficerAllegationButton"
          onClick={() =>
            dispatch(removeOfficerAllegation(officerAllegation.id))
          }
        >
          Remove
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => {
  const officerAllegation = state.ui.removeOfficerAllegationDialog.allegation;
  const caseOfficer =
    officerAllegation &&
    state.currentCase.details.accusedOfficers.find(
      caseOfficer => caseOfficer.id === officerAllegation.caseOfficerId
    );

  return {
    open: state.ui.removeOfficerAllegationDialog.open,
    officerAllegation: officerAllegation,
    officerName: caseOfficer ? caseOfficer.fullName : ""
  };
};

export default connect(mapStateToProps)(RemoveOfficerAllegationDialog);
