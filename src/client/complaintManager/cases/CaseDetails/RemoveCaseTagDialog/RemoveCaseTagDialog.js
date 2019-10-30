import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { REMOVE_CASE_TAG_FORM_NAME } from "../../../../../sharedUtilities/constants";
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
} from "../../../shared/components/StyledButtons";
import { closeRemoveCaseTagDialog } from "../../../actionCreators/casesActionCreators";
import removeCaseTag from "../../thunks/removeCaseTag";

class RemoveCaseTagDialog extends Component {
  render() {
    const { dialogOpen, caseTag, dispatch, submitting } = this.props;

    return (
      <Dialog open={dialogOpen} fullWidth={true}>
        <DialogTitle data-test="removeCaseTagDialogTitle">
          Remove Case Tag
        </DialogTitle>
        <DialogContent>
          <Typography style={{ marginBottom: "24px" }}>
            This action will remove the <b>{caseTag.tag.name}</b> tag from the
            case. Are you sure you want to continue?
          </Typography>
          <div />
        </DialogContent>
        <DialogActions
          style={{
            padding: "0px 24px 16px 24px",
            marginLeft: "0",
            marginRight: "0",
            justifyContent: "space-between"
          }}
        >
          <SecondaryButton
            style={{
              marginLeft: "0px"
            }}
            data-test="cancelButton"
            onClick={() => dispatch(closeRemoveCaseTagDialog())}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="removeCaseTag"
            onClick={() => dispatch(removeCaseTag(caseTag.caseId, caseTag.id))}
            disabled={submitting}
          >
            Remove
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const RemoveCaseTagDialogForm = reduxForm({
  form: REMOVE_CASE_TAG_FORM_NAME
})(RemoveCaseTagDialog);

const mapStateToProps = state => ({
  dialogOpen: state.ui.removeCaseTagDialog.dialogOpen,
  caseTag: state.ui.removeCaseTagDialog.caseTag
});

export default connect(mapStateToProps)(RemoveCaseTagDialogForm);
