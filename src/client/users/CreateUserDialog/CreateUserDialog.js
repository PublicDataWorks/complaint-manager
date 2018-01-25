import React from 'react'
import {submit} from 'redux-form';
import {connect} from "react-redux";
import {Button, Dialog, DialogActions, DialogTitle, DialogContent, withTheme} from "material-ui";
import {CancelButton, SubmitButton} from "../../sharedComponents/StyledButtons";
import CreateUserForm from './CreateUserForm'
import {closeUserSnackbar} from "../actionCreators";

const margin = {
    marginLeft: '5%',
    marginTop: '2%',
    marginBottom: '2%'
}
class CreateUserDialog extends React.Component {
    state = {
        dialogOpen: false
    }

    componentWillReceiveProps = (nextProps) =>{
        if (!this.props.userCreationSuccess && nextProps.userCreationSuccess){
            this.closeDialog()
        }
    }

    openDialog = () => {
        this.setState({dialogOpen: true})
        this.props.dispatch(closeUserSnackbar())
    }

    closeDialog = () => {
        this.setState({dialogOpen: false})
    }

    render() {
        const {theme} = this.props

        return (
            <div>
                <Dialog
                    data-test="createUserDialog"
                    open={this.state.dialogOpen}
                >
                    <DialogTitle>
                        <div data-test="createUserDialogTitle">
                            Add New User
                        </div>
                    </DialogTitle>

                    <DialogContent style={{padding: '0px 24px'}}>
                        <CreateUserForm />
                    </DialogContent>

                    <DialogActions style={{justifyContent: 'space-between', margin: `${theme.spacing.unit * 2}px`}}>
                        <CancelButton
                            data-test="cancelUser"
                            onClick={this.closeDialog}
                        >
                            Cancel
                        </CancelButton>
                        <SubmitButton
                            data-test="submitUser"
                            onClick={() => this.props.dispatch(submit('CreateUser'))}
                        >
                            Add User
                        </SubmitButton>
                    </DialogActions>
                </Dialog>

                <Button
                    raised
                    data-test="createUserButton"
                    onClick={this.openDialog}
                    color="primary"
                    style={margin}
                >
                    Add New User
                </Button>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        userCreationSuccess: state.users.creation.success
    }
}

export default withTheme()(connect(mapStateToProps)(CreateUserDialog))