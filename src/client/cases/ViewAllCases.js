import React from 'react';
import HomeIcon from 'material-ui-icons/Home';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import {
    AppBar, IconButton, Button, Dialog, Toolbar, Typography, DialogTitle, DialogContent,
    DialogContentText, DialogActions
} from 'material-ui'
import CreateCaseForm from './CreateCaseForm'
import { connect } from 'react-redux'
import { submit } from 'redux-form'
import { requestCaseCreation } from "./actionCreators"

class ViewAllCases extends React.Component {
    state = {
        open: false,
    };

    componentWillReceiveProps = (nextProps) => {
        if (this.props.caseCreationInProgress && !nextProps.caseCreationInProgress) {
            this.handleClose()
        }
    }

    handleOpen = () => {
        this.setState({open: true})
    }

    handleClose = () => {
        this.setState({open: false})
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
        caseCreationInProgress: state.cases.inProgress
    }
}

export default connect(mapStateToProps)(ViewAllCases)