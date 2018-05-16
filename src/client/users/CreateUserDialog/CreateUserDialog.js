import React from "react";
import { submit } from "redux-form";
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withTheme
} from "material-ui";
import {
  SecondaryButton,
  PrimaryButton
} from "../../sharedComponents/StyledButtons";
import CreateUserForm from "./CreateUserForm";
import { closeSnackbar } from "../../actionCreators/snackBarActionCreators";

const margin = {
  marginLeft: "5%",
  marginTop: "2%",
  marginBottom: "2%"
};
class CreateUserDialog extends React.Component {
  state = {
    dialogOpen: false
  };

  componentWillReceiveProps = nextProps => {
    if (!this.props.userCreationSuccess && nextProps.userCreationSuccess) {
      this.closeDialog();
    }
  };

  openDialog = () => {
    this.setState({ dialogOpen: true });
    this.props.dispatch(closeSnackbar());
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const { theme } = this.props;

    return (
      <div>
        <Dialog data-test="createUserDialog" open={this.state.dialogOpen}>
          <DialogTitle>
            <div data-test="createUserDialogTitle">Add New User</div>
          </DialogTitle>

          <DialogContent style={{ padding: "0px 24px" }}>
            <CreateUserForm />
          </DialogContent>

          <DialogActions
            style={{
              justifyContent: "space-between",
              margin: `${theme.spacing.unit * 2}px`
            }}
          >
            <SecondaryButton data-test="cancelUser" onClick={this.closeDialog}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              data-test="submitUser"
              onClick={() => this.props.dispatch(submit("CreateUser"))}
            >
              Add User
            </PrimaryButton>
          </DialogActions>
        </Dialog>

        <Button
          variant="raised"
          data-test="createUserButton"
          onClick={this.openDialog}
          color="primary"
          style={margin}
        >
          Add New User
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userCreationSuccess: state.ui.snackbar.success
  };
};

export default withTheme()(connect(mapStateToProps)(CreateUserDialog));
