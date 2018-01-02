import React from 'react';
import HomeIcon from 'material-ui-icons/Home';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import Snackbar from 'material-ui/Snackbar'
import {AppBar, IconButton, Toolbar, Typography} from 'material-ui'
import {connect} from 'react-redux'
import CloseIcon from 'material-ui-icons/Close';
import CasesTable from "./CasesTable";
import CreateCase from "./CreateCase";

class ViewAllCases extends React.Component {
  state = {
    snackbarOpen: false
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.caseCreationInProgress && !nextProps.caseCreationInProgress) {
      this.openSnackbar()
    }
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
        <CreateCase />
        <CasesTable cases={this.props.cases}/>

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