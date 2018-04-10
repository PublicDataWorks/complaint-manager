import React from 'react'
import moment from "moment/moment";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "material-ui";
import {TextField} from "redux-form-material-ui"
import DateField from "../../sharedFormComponents/DateField";
import {Field, reduxForm} from "redux-form";
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";
import editIncidentDetails from "../../thunks/editIncidentDetails";
import { nullifyFieldUnlessValid } from "../../../utilities/fieldNormalizers";

const submitIncidentDetails = (values, dispatch, props) => {
    const normalizedValuesWithId = {
        ...values,
        incidentDate: nullifyFieldUnlessValid(values.incidentDate),
        incidentTime: nullifyFieldUnlessValid(values.incidentTime),
        id: props.caseId
    }

    return dispatch(editIncidentDetails(normalizedValuesWithId, props.handleDialogClose))
}

const IncidentDetailsDialog = (props) => (
    <Dialog
        open={props.dialogOpen}
        fullWidth={false}
    >
        <DialogTitle
            data-test="editIncidentDetailsTitle"
        >
            Edit Incident Details
        </DialogTitle>
        <DialogContent>
            <form>
                <DateField
                required={true}
                name='firstContactDate'
                label='First Contact Date'
                data-test="editFirstContactDateField"
                inputProps={{
                    "data-test": "editFirstContactDateInput",
                    type: "date",
                    max: moment(Date.now()).format('YYYY-MM-DD')
                }}
                style={{marginBottom: '16px'}}
                />
                <br/>
                <DateField
                    name='incidentDate'
                    label='Incident Date'
                    data-test="editIncidentDateField"
                    inputProps={{
                        "data-test": "editIncidentDateInput",
                        type: "date",
                        max: moment(Date.now()).format('YYYY-MM-DD'),
                    }}
                    style={{
                        marginRight: '16px',
                    }}
                    clearable={true}
                />
                <Field
                    component={TextField}
                    name='incidentTime'
                    label='Incident Time'
                    data-test="editIncidentTimeField"
                    inputProps={{
                        "data-test": "editIncidentTimeInput",
                        type: "time"
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>
        </DialogContent>
        <DialogActions
            style={{justifyContent: 'space-between', margin: '16px'}}
        >
            <CancelButton
                data-test="cancelEditIncidentDetailsButton"
                onClick={props.handleDialogClose}
            >
                Cancel
            </CancelButton>
            <SubmitButton
                data-test="saveIncidentDetailsButton"
                onClick={props.handleSubmit(submitIncidentDetails)}
            >
                Save
            </SubmitButton>
        </DialogActions>
    </Dialog>
)

export default reduxForm({ form: 'IncidentDetails' })(IncidentDetailsDialog)