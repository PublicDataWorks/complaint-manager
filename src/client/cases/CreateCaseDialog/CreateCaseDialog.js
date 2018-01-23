import React from "react";
import {submit} from "redux-form";
import {connect} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "material-ui";
import CreateCaseForm from "./CreateCaseForm";
import {CancelButton, SubmitButton} from "../../sharedComponents/StyledButtons";
import {withTheme} from "material-ui/styles";
import LinkButton from "../../sharedComponents/LinkButton";
import {redirectToCaseDetail} from "../actionCreators";


const margin = {
    marginLeft: '5%',
    marginTop: '2%',
    marginBottom: '2%'
}

class CreateCaseDialog extends React.Component {
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

    createAndView = () => {
        this.props.dispatch(redirectToCaseDetail())
        this.props.dispatch(submit('CreateCase'))
    }

    render() {
        const {theme} = this.props

        return (
            <div>
                <SubmitButton
                    data-test="createCaseButton"
                    onClick={this.openDialog}
                    style={margin}
                >
                    Create New Case
                </SubmitButton>
                <Dialog
                    data-test="createCaseDialog"
                    open={this.state.dialogOpen}
                >
                    <DialogTitle data-test="createCaseDialogTitle" style={{paddingBottom: '1%'}}>
                        Create New Case
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{paddingBottom: '3%'}}>
                            <Typography type='caption'>
                                Enter as much information as available to start a case. You will be able to edit this
                                information later.
                            </Typography>
                        </DialogContentText>
                        <CreateCaseForm/>
                    </DialogContent>
                    <DialogActions style={{justifyContent: 'space-between', margin: `${theme.spacing.unit * 2}px`}}>
                        <CancelButton
                            data-test="cancelCase"
                            onClick={this.closeDialog}
                        >
                            Cancel
                        </CancelButton>
                        <div>
                            <LinkButton
                                data-test="createCaseOnly"
                                onClick={() => this.props.dispatch(submit('CreateCase'))}
                            >
                                Create Only
                            </LinkButton>
                            <SubmitButton
                                data-test="createAndView"
                                onClick={this.createAndView}
                            >
                                Create And View
                            </SubmitButton>
                        </div>
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

const connectedDialog = connect(mapStateToProps)(CreateCaseDialog)
export default withTheme()(connectedDialog)