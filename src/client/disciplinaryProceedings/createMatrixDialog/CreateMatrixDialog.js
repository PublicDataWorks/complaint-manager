import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withStyles
} from "@material-ui/core";
import { reduxForm } from "redux-form";
import React from "react";
import { CREATE_MATRIX_FORM_NAME } from "../../../sharedUtilities/constants";
import { SecondaryButton } from "../../shared/components/StyledButtons";
import { closeCreateDialog } from "../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../common/actionCreators/dialogTypes";
import PIBControlField from "../sharedFormComponents/PIBControlField";

const styles = {
  dialogPaper: {
    minWidth: "40%"
  }
};

class CreateMatrixDialog extends React.Component {
  closeDialog = () => {
    this.props.closeCreateDialog(DialogTypes.MATRIX);
    this.props.reset(CREATE_MATRIX_FORM_NAME);
  };

  render() {
    return (
      <Dialog
        data-test="create-matrix-dialog"
        classes={{ paper: this.props.classes.dialogPaper }}
        open={this.props.open}
        fullWidth
      >
        <DialogTitle
          data-test="create-matrix-dialog-title"
          style={{ paddingBottom: "1%" }}
        >
          Create New Matrix
        </DialogTitle>
        <DialogContent style={{ padding: "0px 24px" }}>
          <form data-test="create-matrix-form">
            <PIBControlField />
          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton data-test="cancel-matrix" onClick={this.closeDialog}>
            Cancel
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  return {
    open: state.ui.createDialog.matrix.open
  };
};

const mapDispatchToProps = {
  closeCreateDialog: closeCreateDialog
};

const ConnectedDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateMatrixDialog));

export default reduxForm({
  form: CREATE_MATRIX_FORM_NAME,
  initialValues: {}
})(ConnectedDialog);
