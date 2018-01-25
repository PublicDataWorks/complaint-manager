import React from "react";
import {Field, reset, reduxForm} from "redux-form";
import {connect} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "material-ui";
import {CancelButton, SubmitButton} from "../../sharedComponents/StyledButtons";
import {withTheme} from "material-ui/styles";
import LinkButton from "../../sharedComponents/LinkButton";
import {
    firstNameNotBlank,
    firstNameRequired,
    isEmail,
    isPhoneNumber,
    lastNameNotBlank,
    lastNameRequired
} from "../../formValidations";
import ComplainantTypeRadioGroup from "./ComplainantTypeRadioGroup";
import {TextField} from "redux-form-material-ui";
import createCase from "../thunks/createCase";
import {closeCaseSnackbar} from "../actionCreators";


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
        this.props.dispatch(closeCaseSnackbar())
    }

    closeDialog = () => {
        this.setState({dialogOpen: false})
        this.props.dispatch(reset('CreateCase'))
    }

    createAndView = (values, dispatch, props) => {
        const creationDetails = {
            caseDetails: this.trimWhitespace(values),
            redirect: true
        }

        dispatch(createCase(creationDetails))

    }

    createOnly = (values, dispatch, props) => {
        const creationDetails = {
            caseDetails: this.trimWhitespace(values),
            redirect: false
        }

        dispatch(createCase(creationDetails))
    }

    trimWhitespace = (values) => ({
        ...values,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim()
    })

    render() {
        const {theme, handleSubmit} = this.props

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
                        <form data-test="createCaseForm">
                            <Field
                                name="complainantType"
                                component={ComplainantTypeRadioGroup}
                                style={{marginRight: '5%'}}
                            />
                            <br />
                            <Field
                                required
                                name="firstName"
                                component={TextField}
                                label="First Name"
                                inputProps={{
                                    maxLength: 25,
                                    autoComplete: "off",
                                    "data-test": "firstNameInput"
                                }}
                                data-test="firstNameField"
                                validate={[firstNameRequired, firstNameNotBlank]}
                                style={{marginRight: '5%'}}
                            />
                            <Field
                                required
                                name="lastName"
                                component={TextField}
                                label="Last Name"
                                inputProps={{
                                    maxLength: 25,
                                    autoComplete: "off",
                                    "data-test": "lastNameInput"
                                }}
                                data-test="lastNameField"
                                validate={[lastNameRequired, lastNameNotBlank]}
                                style={{marginRight: '5%'}}
                            />
                            <br />
                            <Field
                                name="phoneNumber"
                                component={TextField}
                                label="Phone Number"
                                inputProps={{
                                    "data-test": "phoneNumberInput"
                                }}
                                data-test="phoneNumberField"
                                validate={[isPhoneNumber]}
                                style={{marginRight: '5%'}}
                            />
                            <br />
                            <Field
                                name="email"
                                component={TextField}
                                label="Email"
                                inputProps={{
                                    "data-test": "emailInput",
                                }}
                                data-test="emailField"
                                validate={[isEmail]}
                                style={{marginRight: '5%'}}
                            />
                        </form>
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
                                onClick={handleSubmit(this.createOnly)}
                                style={{marginRight: '10px'}}
                            >
                                Create Only
                            </LinkButton>
                            <SubmitButton
                                data-test="createAndView"
                                onClick={handleSubmit(this.createAndView)}
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

const validate = values => {
    const errors = {}

    if (values.phoneNumber === undefined && values.email === undefined) {
        errors.phoneNumber = 'Please enter phone number or email address'
        errors.email = 'Please enter phone number or email address'
    }

    return errors
}

export const DialogWithTheme = withTheme()(CreateCaseDialog)
const ConnectedDialog = connect(mapStateToProps)(DialogWithTheme)

export default reduxForm({
    form: 'CreateCase',
    initialValues: {
        complainantType: 'Civilian'
    },
    validate
})(ConnectedDialog)