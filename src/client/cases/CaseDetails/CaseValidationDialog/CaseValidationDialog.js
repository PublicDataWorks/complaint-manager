import { DialogTitle, Typography } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import { closeCaseValidationDialog } from "../../../actionCreators/casesActionCreators";
import ListItem from "@material-ui/core/ListItem/ListItem";
import List from "@material-ui/core/List/List";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

const CaseValidationDialog = ({
  open,
  validationErrors,
  closeCaseValidationDialog
}) => {
  const renderValidationErrors = () => {
    return validationErrors.map((error, index) => {
      return (
        <ListItem key={index}>
          <ListItemText
            primary={`${error.message.model}: ${error.message.errorMessage}`}
          />
        </ListItem>
      );
    });
  };

  return (
    <Dialog open={open}>
      <DialogTitle data-test="case-validation-dialog-title">
        Insufficient Case Information
      </DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
          data-test="dialogText"
        >
          Please make sure that you complete the following:
        </Typography>
        <List dense={true}>{renderValidationErrors()}</List>
      </DialogContent>
      <DialogActions>
        <PrimaryButton
          data-test="close-case-validation-dialog-button"
          onClick={closeCaseValidationDialog}
        >
          Close
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = {
  closeCaseValidationDialog
};

const mapStateToProps = state => ({
  open: state.ui.caseValidationDialog.open,
  validationErrors: state.ui.caseValidationDialog.validationErrors
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseValidationDialog);
