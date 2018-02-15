import React from 'react';
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Dialog, DialogActions, DialogContent, DialogTitle, Typography} from 'material-ui';
import {TextField} from "redux-form-material-ui";
import RoleOnCaseRadioGroup from "./RoleOnCaseRadioGroup";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";
import {closeEditDialog} from "../../actionCreators";
import {notFutureDate} from "../../../formValidations";
import moment from "moment";

class EditCivilianDialog extends React.Component {

    render() {
        return (
            <Dialog
                open={this.props.open}
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
                            style={{marginRight: '5%', marginBottom: '3%', width: '50%', clipPath: 'inset(0 17px 0 0)'}}
                            validate={[notFutureDate]}
                        />
                        <br/>
                        <Typography type='body2' style={{marginBottom: '8px'}}>Contact Information</Typography>
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
                        data-test="submitEditCivilian">
                        Save
                    </SubmitButton>
                </DialogActions>
            </Dialog>
        )
    }
}

const connectedForm = reduxForm({
    form: 'EditCivilian'
})(EditCivilianDialog)

const mapStateToProps = (state, ownProps) => ({
    open: state.ui.editCivilianDialog.open,

    initialValues: {
        ...ownProps.civilian,
        roleOnCase: 'primaryComplainant',
        birthDate: 'YYYY-MM-DD',
    }
})

export default connect(mapStateToProps)(connectedForm)
