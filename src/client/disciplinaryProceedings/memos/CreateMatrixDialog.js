import { connect } from "react-redux";
import {
  DialogTitle,
  Dialog,
  withStyles,
  DialogActions
} from "@material-ui/core";
import { reduxForm } from "redux-form";
import React from "react";
import { CREATE_MATRIX_FORM_NAME } from "../../../sharedUtilities/constants";
import { SecondaryButton } from "../../shared/components/StyledButtons";
import { closeCreateDialog } from "../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../common/actionCreators/dialogTypes";

const styles = {
  dialogPaper: {
    minWidth: "40%"
  }
};

class CreateMatrixDialog extends React.Component {
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
        <DialogActions>
          <SecondaryButton
            data-test="cancel-matrix"
            onClick={() => this.props.closeCreateDialog(DialogTypes.MATRIX)}
          >
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
