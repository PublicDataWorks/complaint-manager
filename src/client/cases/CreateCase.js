import React from "react";
import {submit} from "redux-form";
import {connect} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui";
import CreateCaseForm from "./CreateCaseForm";

class CreateCase extends React.Component {
    state = {
        dialogOpen: false
    }

    componentWillReceiveProps = (nextProps) => {
        if (!this.props.caseCreationSuccess && nextProps.caseCreationSuccess) {
            this.closeDialog()
        }
    }

    openDialog = () => {
        this.setState({dialogOpen: true})
    }

    closeDialog = () => {
        this.setState({dialogOpen: false})
    }

    render() {
        return (
            <div>
                <Button
                    raised
                    data-test="createCaseButton"
                    onClick={this.openDialog}
                    color="primary"
                >
                    + Create New Case
                </Button>
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
        )
    }
}

const mapStateToProps = state => {
    return {
        caseCreationSuccess: state.cases.creation.success
    }
}

export default connect(mapStateToProps)(CreateCase)