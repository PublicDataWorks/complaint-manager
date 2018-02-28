import React from "react";
import {change, Field, reduxForm, reset} from "redux-form";
import {connect} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "material-ui";
import {CancelButton, SubmitButton} from "../../sharedComponents/StyledButtons";
import {withTheme} from "material-ui/styles";
import FirstNameField from "../sharedFormComponents/FirstNameField";
import LastNameField from "../sharedFormComponents/LastNameField";
import PhoneNumberField from "../sharedFormComponents/PhoneNumberField";
import EmailField from "../sharedFormComponents/EmailField";
import LinkButton from "../../sharedComponents/LinkButton";
import ComplainantTypeRadioGroup from "./ComplainantTypeRadioGroup";
import createCase from "../thunks/createCase";
import {closeSnackbar} from "../../snackbar/actionCreators";
import moment from "moment";
import DateField from "../sharedFormComponents/DateField";
import MiddleInitialField from "../sharedFormComponents/MiddleInitialField";
import SuffixField from "../sharedFormComponents/SuffixField";

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

    createAndView = (values, dispatch) => {
        const creationDetails = {
            caseDetails: this.prepareCaseDetails(values),
            redirect: true
        }

        dispatch(createCase(creationDetails))

    }

    createOnly = (values, dispatch) => {
        const creationDetails = {
            caseDetails: this.prepareCaseDetails(values),
            redirect: false
        }

        dispatch(createCase(creationDetails))
    }

    prepareCaseDetails = (values) => ({
        case: {
            ...values.case,
            createdBy: this.props.currentUser,
            assignedTo: this.props.currentUser
        },
        civilian: {
            ...values.civilian,
            firstName: values.civilian.firstName.trim(),
            lastName: values.civilian.lastName.trim()
        }
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
                    fullWidth
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
                            <DateField
                                fieldProps={{
                                    required: true,
                                    name: 'case.firstContactDate',
                                    label: 'First Contact Date',
                                    'data-test': 'firstContactDateField',
                                }}
                                inputProps={{
                                    "data-test": "firstContactDateInput",
                                }}
                                style={{...offSet, width: '35%', clipPath: 'inset(0 17px 0 0)'}}
                            />
                            <br/>
                            <Field
                                name='case.complainantType'
                                component={ComplainantTypeRadioGroup}
                            />
                            <br/>
                            <FirstNameField name='civilian.firstName'/>
                            <MiddleInitialField
                                name='civilian.middleInitial'
                                style={{
                                    width:'40px',
                                    marginRight:'5%'
                                }}
                            />
                            <LastNameField name='civilian.lastName'/>
                            <SuffixField
                                name='civilian.suffix'
                                style={{
                                    width:'120px'
                                }}
                            />
                            <br/>
                            <PhoneNumberField name={'civilian.phoneNumber'}/>
                            <EmailField name={'civilian.email'}/>
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
        caseCreationSuccess: state.ui.snackbar.success,
        currentUser: state.users.current.userInfo.nickname
    }
}

const validate = values => {
    const errors = {
        case: {},
        civilian: {}
    }

    if (!values.civilian || civilianDefinedWithoutPhoneNumberOrEmail(values)) {
        errors.civilian.phoneNumber = 'Please enter phone number or email address'
        errors.civilian.email = 'Please enter phone number or email address'
    }

    return errors
}

const civilianDefinedWithoutPhoneNumberOrEmail = (values) => (
    values.civilian && !values.civilian.phoneNumber && !values.civilian.email
)

export const DialogWithTheme = withTheme()(CreateCaseDialog)
const ConnectedDialog = connect(mapStateToProps)(DialogWithTheme)

const handleOnChange = (values, dispatch, props, previousValues) => {
    if (!Boolean(values.case.firstContactDate)) {
        dispatch(change('CreateCase', 'case.firstContactDate', previousValues.case.firstContactDate))
    }
}

export default reduxForm({
    form: 'CreateCase',
    initialValues: {
        case: {
            complainantType: 'Civilian',
            firstContactDate: moment(Date.now()).format('YYYY-MM-DD')
        }
    },
    onChange: handleOnChange,
    validate
})(ConnectedDialog)