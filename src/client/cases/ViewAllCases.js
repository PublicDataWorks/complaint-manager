import React from 'react';
import HomeIcon from 'material-ui-icons/Home';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import Snackbar from 'material-ui/Snackbar'
import {
  AppBar, IconButton, Button, Dialog, Toolbar, Typography, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from 'material-ui'
import CreateCaseForm from './CreateCaseForm'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import CloseIcon from 'material-ui-icons/Close';
import CasesTable from "./CasesTable";

class ViewAllCases extends React.Component {
  state = {
    dialogOpen: false,
    snackbarOpen: false,

  };

  componentWillReceiveProps = (nextProps) => {
    if (!this.props.caseCreationSuccess && nextProps.caseCreationSuccess) {
      this.closeDialog()
    }
    if (this.props.caseCreationInProgress && !nextProps.caseCreationInProgress) {
      this.openSnackbar()
    }
  }

  openDialog = () => {
    this.setState({dialogOpen: true})
  }

  closeDialog = () => {
    this.setState({dialogOpen: false})
  }

  openSnackbar = () => {
      this.setState({snackbarOpen: true})
  }
  closeSnackbar = () => {
    this.setState({snackbarOpen: false})
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton>
              <HomeIcon/>
            </IconButton>
            <Typography
              data-test="pageTitle"
              type="title"
              color="inherit"
            >
              View All Cases
            </Typography>
            <IconButton>
              <AccountCircleIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          open={this.state.snackbarOpen}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span data-test="createCaseBannerText">
                  {this.props.caseCreationMessage}
                  </span>}
          action={[
            <IconButton
              key={'closeSnackBar'}
              onClick={this.closeSnackbar}
            >
              <CloseIcon/>
            </IconButton>,
          ]}
        />
        <Button
          raised
          data-test="createCaseButton"
          onClick={this.openDialog}
          color="primary"
        >
            + Create New Case
        </Button>
        <CasesTable cases={this.props.cases}/>
        <Dialog
          data-test="createCaseDialog"
          open={this.state.dialogOpen}
        >
          <DialogTitle>
            <div data-test="createCaseDialogTitle">
              Create New Case
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter as much information as available to start a case. You will be able to edit this
              information later.
            </DialogContentText>
            <CreateCaseForm/>
          </DialogContent>
          <DialogActions>
            <Button
              raised
              data-test="cancelCase"
              onClick={this.closeDialog}
            >
              Cancel
            </Button>
            <Button
              raised
              data-test="submitCase"
              onClick={() => this.props.dispatch(submit('CreateCase'))}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    caseCreationInProgress: state.cases.creation.inProgress,
    caseCreationSuccess: state.cases.creation.success,
    caseCreationMessage: state.cases.creation.message,
    cases: state.cases.all
  }
}

export default connect(mapStateToProps)(ViewAllCases)