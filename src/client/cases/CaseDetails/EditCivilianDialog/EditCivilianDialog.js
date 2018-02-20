import React from 'react';
import {connect} from "react-redux";
import {change, Field, reduxForm, submit} from "redux-form";
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Typography} from 'material-ui';
import {TextField} from "redux-form-material-ui";
import RoleOnCaseRadioGroup from "./RoleOnCaseRadioGroup";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";
import {closeEditDialog} from "../../actionCreators";
import {genderIdentityIsRequired, notFutureDate, raceEthnicityIsRequired} from "../../../formValidations";
import moment from "moment";
import editCivilian from "../../thunks/editCivilian";
import NoBlurTextField from "./FormSelect";
import _ from "lodash"

const generateMenu = contents => {
    return contents.map((content) => {
        return (
            <MenuItem
                key={_.snakeCase(content)}
                value={_.snakeCase(content)}
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
                            component={RoleOnCaseRadioGroup}/>
                        <br/>
                        <Typography type='body2' style={{marginBottom: '8px'}}>Personal Information</Typography>
                        <FirstNameField name={'firstName'}/>
                        <LastNameField name={'lastName'}/>
                        <br/>
                        <Field
                            name='birthDate'
                            component={TextField}
                            label='Birthday'
                            inputProps={{
                                "data-test": "birthDateInput",
                                type: "date",
                                max: moment(Date.now()).format('YYYY-MM-DD')
                            }}
                            data-test="birthDateField"
                            style={{ marginBottom: '3%', width: '30%', clipPath: 'inset(0 17px 0 0)'}}
                            validate={[notFutureDate]}
                        />
                        <Field
                            required
                            name="gender"
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
                        <br/>
                        <Field
                            required
                            name="raceEthnicity"
                            component={NoBlurTextField}
                            label='Race/Ethnicity'
                            hinttext='Race/Ethnicity'
                            data-test="raceDropdown"
                            style={{width: '75%',  marginBottom: '24px'}}
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
                <DialogActions>
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
    dispatch(editCivilian(values))
}

const handleOnChange = (values, dispatch, props, previousValues) => {

    if (!Boolean(values.birthDate)) {
        dispatch(change('EditCivilian', 'birthDate', ' '))
    }

}

const connectedForm = reduxForm({
    form: 'EditCivilian',
    onSubmit: handleEditCivilian,
    onChange: handleOnChange
})(EditCivilianDialog)

const mapStateToProps = (state, ownProps) => ({
    open: state.ui.editCivilianDialog.open,

    initialValues: {
        ...ownProps.civilian,
        roleOnCase: 'Primary Complainant',
        birthDate: ' ',
    }
})

export default connect(mapStateToProps)(connectedForm)
