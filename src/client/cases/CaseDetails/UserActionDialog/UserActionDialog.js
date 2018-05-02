import React from 'react'
import {Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "material-ui";
import {TextField} from 'redux-form-material-ui'
import {connect} from "react-redux";
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";
import {closeUserActionDialog} from "../../../actionCreators/casesActionCreators";
import {Field, reduxForm, reset} from "redux-form";
import DateField from "../../sharedFormComponents/DateField";
import NoBlurTextField from "../CivilianDialog/FormSelect";
import {userActions} from "../../../utilities/generateMenus";
import addUserAction from "../../thunks/addUserAction";
import {actionIsRequired} from "../../../formFieldLevelValidations";
import timezone from "moment-timezone"
import {TIMEZONE} from "../../../../sharedUtilities/constants";

const UserActionDialog = ({open, caseId, handleSubmit, dispatch}) => {
    const submit = (values, dispatch) => {
        const valuesToSubmit = {
            ...values,
            actionTakenAt: timezone.tz(values.actionTakenAt, TIMEZONE).format(),
            caseId
        }

        dispatch(addUserAction(valuesToSubmit))
    }

    return (
        <Dialog
            open={open}
            maxWidth={'sm'}
        >
            <DialogTitle
                style={{
                    paddingBottom: '8px'
                }}
            >
                Log User Action
            </DialogTitle>
            <DialogContent
                style={{
                    padding: '0px 28px',
                    marginBottom: '24px'
                }}
            >
                <Typography 
                    type='body1'
                    style={{
                        marginBottom: '24px'
                    }}
                >
                    Use this form to log any external correspondences or actions that take place outside of the Complaint Manager System.
                    Your name will automatically be recorded.
                </Typography>
                <form>
                    <DateField
                        required
                        name={'actionTakenAt'}
                        inputProps={{
                            type: 'datetime-local',
                            "data-test":"dateAndTimeInput"
                        }}
                        label={'Date and Time'}
                        style={{
                            marginBottom:'16px',
                            width:'41%'
                        }}
                    />
                    <br/>
                    <Field
                        required
                        name='action'
                        component={NoBlurTextField}
                        label={'Select action taken'}
                        data-test="actionsDropdown"
                        style={{
                            width: '75%',
                            marginBottom: '16px'
                        }}
                        validate={[actionIsRequired]}
                    >
                        {userActions}
                    </Field>
                    <Field
                        name='notes'
                        label='Notes'
                        component={TextField}
                        inputProps={{
                            maxLength: 255,
                            "data-test":"notesInput"
                        }}
                        InputLabelProps={{
                            shrink:true
                        }}
                        multiline
                        placeholder="Enter any notes about this action"
                        fullWidth
                    />
                </form>
            </DialogContent>
            <DialogActions
                style={{
                    padding: '0px 24px 16px 24px',
                    marginLeft: '0',
                    marginRight: '0',
                    justifyContent: 'space-between'
                }}
            >
                <CancelButton
                    style={{
                        marginLeft: '0px'
                    }}
                    data-test="cancelButton"
                    onClick={() => {
                        dispatch(closeUserActionDialog())
                        dispatch(reset('UserActions'))

                    }}
                >
                    Cancel
                </CancelButton>
                <SubmitButton
                    data-test="submitButton"
                    onClick={handleSubmit(submit)}
                >
                    Log Action
                </SubmitButton>
            </DialogActions>
        </Dialog>
    )
}

const ConnectedForm = reduxForm({
    form:'UserActions'
})(UserActionDialog)

const mapStateToProps = state => ({
    open: state.ui.userActionDialog.open,
    caseId: state.currentCase.details.id
})
export default connect(mapStateToProps)(ConnectedForm)