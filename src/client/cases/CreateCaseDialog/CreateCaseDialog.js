import React from "react";
import {change, Field, reduxForm, reset} from "redux-form";
import {connect} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "material-ui";
import {CancelButton, SubmitButton} from "../../sharedComponents/StyledButtons";
import {withTheme} from "material-ui/styles";
import FirstNameField from "../sharedFormComponents/FirstNameField";
import LinkButton from "../../sharedComponents/LinkButton";
import {
    firstNameNotBlank,
    firstNameRequired,
    isEmail,
    isPhoneNumber,
    lastNameNotBlank,
    lastNameRequired,
    notFutureDate,
} from "../../formValidations";
import ComplainantTypeRadioGroup from "./ComplainantTypeRadioGroup";
import {TextField} from "redux-form-material-ui";
import createCase from "../thunks/createCase";
import {closeSnackbar} from "../../snackbar/actionCreators";
import moment from "moment";


const margin = {
    marginLeft: '5%',
    marginTop: '2%',
    marginBottom: '2%'
}

const offSet = {marginRight: '5%', marginBottom: '3%'};

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
        this.props.dispatch(closeSnackbar())
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
                    <DialogContent style={{padding: '0px 24px'}}>
                        <DialogContentText style={{paddingBottom: '3%'}}>
                            <Typography type='caption'>
                                Enter as much information as available to start a case. You will be able to edit this
                                information later.
                            </Typography>
                        </DialogContentText>
                        <form data-test="createCaseForm">
                            <Typography type='body2' style={{marginBottom: '8px'}}>Timeline</Typography>
                            <Field
                                required
                                name='firstContactDate'
                                component={TextField}
                                label='First Contact Date'
                                inputProps={{
                                    "data-test":"firstContactDateInput",
                                    type:"date",
                                    max: moment(Date.now()).format('YYYY-MM-DD'),
                                }}
                                data-test="firstContactDateField"
                                style={{...offSet, width: '35%', clipPath: 'inset(0 17px 0 0)'}}
                                validate={[notFutureDate]}
                            />
                            <br/>
                            <Field
                                name="complainantType"
                                component={ComplainantTypeRadioGroup}
                            />
                            <br />
                            <FirstNameField/>
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
                                style={offSet}
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
                                style={offSet}
                            />
                            <Field
                                name="email"
                                component={TextField}
                                label="Email"
                                inputProps={{
                                    "data-test": "emailInput",
                                }}
                                data-test="emailField"
                                validate={[isEmail]}
                                style={offSet}
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

const handleOnChange = (values, dispatch, props, previousValues) => {

    if (!Boolean(values.firstContactDate)){
        dispatch(change('CreateCase', 'firstContactDate', previousValues.firstContactDate))
    }

}

export default reduxForm({
    form: 'CreateCase',
    initialValues: {
        complainantType: 'Civilian',
        firstContactDate: moment(Date.now()).format('YYYY-MM-DD')
    },
    onChange: handleOnChange,
    validate
})(ConnectedDialog)