import React from 'react'
import {Button, Dialog, DialogActions, DialogTitle} from "material-ui";

class CreateUser extends React.Component {
    state = {
        dialogOpen: false
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
                <Dialog
                    data-test="createUserDialog"
                    open={this.state.dialogOpen}
                >
                    <DialogTitle>
                        <div data-test="createUserDialogTitle">
                            Create New User
                        </div>
                    </DialogTitle>
                    <DialogActions>
                        <Button

                            raised
                            data-test="cancelUser"
                            onClick={this.closeDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            raised
                            data-test="submitUser"
                            onClick={() => alert("hi fellas!")}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                <Button
                    raised
                    data-test="createUserButton"
                    onClick={this.openDialog}
                    color="primary"
                >
                    Create User
                </Button>
            </div>
        )
    }
}

export default CreateUser