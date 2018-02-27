import React from 'react';
import {connect} from "react-redux";
import {change, Field, reduxForm, submit} from "redux-form";
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Typography} from 'material-ui';
import RoleOnCaseRadioGroup from "./RoleOnCaseRadioGroup";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";
import {closeEditDialog} from "../../actionCreators";
import {genderIdentityIsRequired, raceEthnicityIsRequired} from "../../../formValidations";
import editCivilian from "../../thunks/editCivilian";
import NoBlurTextField from "./FormSelect";
import {withTheme} from "material-ui/styles/index";
import DateField from "../../sharedFormComponents/DateField";

const generateMenu = contents => {
    return contents.map((content) => {
        return (
            <MenuItem
                key={content}
                value={content}
            >{content}</MenuItem>)
    })
}

class EditCivilianDialog extends React.Component {

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
                <DialogContent>
                    <form>
                        <Field
                            name="roleOnCase"
                            component={RoleOnCaseRadioGroup}
                            style={{marginBottom: '8px'}}
                        />
                        <Typography type='body2' style={{marginBottom: '8px'}}>Personal Information</Typography>
                        <FirstNameField name={'firstName'}/>
                        <LastNameField name={'lastName'}/>
                        <div style={{display: 'flex'}}>
                            <DateField
                                fieldProps={{
                                    name:'birthDate',
                                    label:'Birthday',
                                    'data-test':'birthDateField'
                                }}
                                inputProps={{
                                    'data-test': 'birthDateInput'
                                }}
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
                                        'No Answer'
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
                                ])
                            }
                        </Field>
                        <Typography type='body2' style={{marginBottom: '16px'}}>Contact Information</Typography>
                    </form>
                </DialogContent>
                <DialogActions style={{justifyContent: 'space-between', margin: `${this.props.theme.spacing.unit * 2}px`}}>
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
    const nullifyDateUnlessValid = date => (date.trim() === '' ? null : date)

    dispatch(editCivilian({
        ...values,
        birthDate: nullifyDateUnlessValid(values.birthDate)
    }))
}

const changeToBlankValueWhenBirthdaySetToInvalidDateSoThatLabelRendersProperly = (values, dispatch) => {
    if (!Boolean(values.birthDate)) {
        dispatch(change('EditCivilian', 'birthDate', ' '))
    }
}

const DialogWithTheme = withTheme()(EditCivilianDialog)

const connectedForm = reduxForm({
    form: 'EditCivilian',
    onSubmit: handleEditCivilian,
    onChange: changeToBlankValueWhenBirthdaySetToInvalidDateSoThatLabelRendersProperly
})(DialogWithTheme)

const mapStateToProps = (state) => ({
    open: state.ui.editCivilianDialog.open,
})

export default connect(mapStateToProps)(connectedForm)
