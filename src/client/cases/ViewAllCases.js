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
import {requestCaseCreation} from "./actionCreators"

class ViewAllCases extends React.Component {
  state = {
    open: false,
    snackbarVisible: false,

  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.caseCreationInProgress && !nextProps.caseCreationInProgress) {
      this.handleClose()
    }
    if (this.props.caseCreationResult == null && nextProps.caseCreationResult != null) {
      this.setState({snackbarVisible: true})
    }
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  handleSnackBarClose = () => {
    this.setState({snackbarVisible: false})
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
          open={this.state.snackbarVisible}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span data-test="createCaseBannerText">
                  {this.props.caseCreationResult ? this.props.caseCreationResult.message : ''}
                  </span>}
          action={[
            <IconButton
              key={'closeSnackBar'}
              onClick={this.handleSnackBarClose}
            >
              <CloseIcon/>
            </IconButton>,
          ]}
        />
        <Button
          raised
          data-test="createCaseButton"
          onClick={this.handleOpen}
        >
          Create New Case
        </Button>
        <Dialog
          data-test="createCaseDialog"
          open={this.state.open}
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
              onClick={this.handleClose}
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
    caseCreationResult: state.cases.creation.result
  }
}

export default connect(mapStateToProps)(ViewAllCases)