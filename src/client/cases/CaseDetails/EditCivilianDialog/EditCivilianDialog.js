import React, {Component} from 'react';
import {connect} from "react-redux";
import { Field, formValueSelector, reduxForm, submit} from "redux-form";
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Typography} from 'material-ui';
import {TextField} from 'redux-form-material-ui'
import RoleOnCaseRadioGroup from "./RoleOnCaseRadioGroup";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";
import {closeEditDialog} from "../../../actionCreators/casesActionCreators";
import {genderIdentityIsRequired, raceEthnicityIsRequired} from "../../../formFieldLevelValidations";
import editCivilian from "../../thunks/editCivilian";
import NoBlurTextField from "./FormSelect";
import {withTheme} from "material-ui/styles/index";
import DateField from "../../sharedFormComponents/DateField";
import MiddleInitialField from "../../sharedFormComponents/MiddleInitialField";
import SuffixField from "../../sharedFormComponents/SuffixField";
import PhoneNumberField from "../../sharedFormComponents/PhoneNumberField";
import EmailField from "../../sharedFormComponents/EmailField";
import {atLeastOneRequired} from "../../../formSyncValidations";
import AddressAutoSuggest from "./AddressAutoSuggest";
import AddressSuggestionEngine from "./SuggestionEngines/addressSuggestionEngine";
import formatAddress from "../../../utilities/formatAddress";
import moment from "moment"

const generateMenu = contents => {
    return contents.map((content) => {
        return (
            <MenuItem
                key={content}
                value={content}
            >{content}</MenuItem>)
    })
}

class EditCivilianDialog extends Component {

    //TODO  IS there a good way to do dependency injection in react/redux?
    // It's generally poor form to have a default service instance.
    // Would it be a bad idea to have a set of services defined in some corner of Redux
    // that would be set differently based on the environment?
    constructor(props) {
        super(props)
        this.suggestionEngine = props.suggestionEngine || new AddressSuggestionEngine()
    }


    render() {
        return (
            <Dialog
                open={this.props.open}
                fullWidth
            >
                <DialogTitle
                    data-test="editDialogTitle"
                >
                    Edit Civilian
                </DialogTitle>
                <DialogContent
                    style={{padding: '0px 24px'}}
                >
                    <form>
                        <Field
                            name="roleOnCase"
                            component={RoleOnCaseRadioGroup}
                            style={{marginBottom: '8px'}}
                        />
                        <Typography type='body2' style={{marginBottom: '8px'}}>Personal Information</Typography>
                        <FirstNameField name='firstName'/>
                        <MiddleInitialField
                            name='middleInitial'
                            style={{
                                width: '40px',
                                marginRight: '5%'
                            }}
                        />
                        <LastNameField name='lastName'/>
                        <SuffixField
                            name='suffix'
                            style={{
                                width: '120px'
                            }}
                        />
                        <div style={{display: 'flex'}}>
                            <DateField
                                name='birthDate'
                                label='Birthday'
                                data-test='birthDateField'
                                inputProps={{
                                    'data-test': 'birthDateInput',
                                    type: "date",
                                    max: moment(Date.now()).format('YYYY-MM-DD')
                                }}
                                clearable={true}
                                style={{
                                    width: '30%',
                                    clipPath: 'inset(0 17px 0 0)',
                                    marginRight: '5%',
                                    marginBottom: '3%',
                                }}
                            />
                            <Field
                                required
                                name="genderIdentity"
                                component={NoBlurTextField}
                                label='Gender Identity'
                                hinttext='Gender Identity'
                                data-test="genderDropdown"
                                style={{width: '30%'}}
                                validate={[genderIdentityIsRequired]}
                            >
                                {
                                    generateMenu([
                                        'Female',
                                        'Male',
                                        'Trans Female',
                                        'Trans Male',
                                        'Other',
                                        'Unknown'
                                    ])
                                }
                            </Field>
                        </div>
                        <Field
                            required
                            name="raceEthnicity"
                            component={NoBlurTextField}
                            label='Race/Ethnicity'
                            hinttext='Race/Ethnicity'
                            data-test="raceDropdown"
                            style={{width: '75%', marginBottom: '24px'}}
                            validate={[raceEthnicityIsRequired]}
                        >
                            {
                                generateMenu([
                                    'American Indian or Alaska Native',
                                    'Asian Indian',
                                    'Black, African American',
                                    'Chinese',
                                    'Cuban',
                                    'Filipino',
                                    'Guamanian or Chamorro',
                                    'Hispanic, Latino, or Spanish origin',
                                    'Japanese',
                                    'Korean',
                                    'Mexican, Mexican American, Chicano',
                                    'Native Hawaiian',
                                    'Puerto Rican',
                                    'Vietnamese',
                                    'Samoan',
                                    'White',
                                    'Other Pacific Islander',
                                    'Other Asian',
                                    'Other',
                                    'Unknown'
                                ])
                            }
                        </Field>
                        <Typography type='body2' style={{marginBottom: '8px'}}>Contact Information</Typography>
                        <PhoneNumberField name='phoneNumber'/>
                        <EmailField name='email'/>
                        <AddressAutoSuggest
                            label='Address'
                            suggestionEngine={this.suggestionEngine}
                            defaultText={this.props.formattedAddress}
                            data-test='addressSuggestionField'
                        />
                        <Field
                            label={'Additional Address Information'}
                            name={'address.streetAddress2'}
                            component={TextField}
                            style={{
                                marginRight: '5%',
                                marginBottom: '8px',
                                width: '50%'
                            }}
                            inputProps={{
                                'data-test': 'streetAddress2Input'
                            }}
                        />
                        <Field
                            type={'hidden'}
                            name={'address.streetAddress'}
                            component={TextField}
                            inputProps={{
                                'data-test': 'streetAddressInput'
                            }}
                        />
                        <Field
                            type={'hidden'}
                            name={'address.city'}
                            component={TextField}
                            inputProps={{
                                'data-test': 'cityInput'
                            }}
                        />
                        <Field
                            type={'hidden'}
                            name={'address.state'}
                            component={TextField}
                            inputProps={{
                                'data-test': 'stateInput'
                            }}
                        />
                        <Field
                            type={'hidden'}
                            name={'address.zipCode'}
                            component={TextField}
                            inputProps={{
                                'data-test': 'zipCodeInput'
                            }}
                        />
                        <Field
                            type={'hidden'}
                            name={'address.country'}
                            component={TextField}
                            inputProps={{
                                'data-test': 'countryInput'
                            }}
                        />
                    </form>
                </DialogContent>
                <DialogActions
                    style={{justifyContent: 'space-between', margin: `${this.props.theme.spacing.unit * 2}px`}}>
                    <CancelButton
                        data-test="cancelEditCivilian"
                        onClick={() => this.props.dispatch(closeEditDialog())}
                    >
                        Cancel
                    </CancelButton>
                    <SubmitButton
                        data-test="submitEditCivilian"
                        onClick={() => this.props.dispatch(submit('EditCivilian'))}
                    >
                        Save
                    </SubmitButton>
                </DialogActions>
            </Dialog>
        )
    }
}

const handleEditCivilian = (values, dispatch) => {
    //The database can't handle the empty string we use for display purposes.  So, strip it out before sending off to the API
    const nullifyDateUnlessValid = date => (date && date.trim() === '' ? null : date)

    dispatch(editCivilian({
        ...values,
        birthDate: nullifyDateUnlessValid(values.birthDate)
    }))
}


const validate = values => {
    const errorMessage = 'Please enter phone number or email address'
    const fieldsToValidate = ['phoneNumber', 'email'];
    return atLeastOneRequired(values, errorMessage, fieldsToValidate)
}


const DialogWithTheme = withTheme()(EditCivilianDialog)

const connectedForm = reduxForm({
    form: 'EditCivilian',
    onSubmit: handleEditCivilian,
    validate
})(DialogWithTheme)

const mapStateToProps = (state) => {
    const selector = formValueSelector('EditCivilian')
    const values = selector(state,
        'address.streetAddress', 'address.city',
        'address.state', 'address.zipCode', 'address.country')

    return {
        open: state.ui.editCivilianDialog.open,
        formattedAddress: formatAddress(values.address)
    }
}

export default connect(mapStateToProps)(connectedForm)
