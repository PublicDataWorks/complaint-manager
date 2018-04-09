import React from 'react'
import moment from "moment/moment";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "material-ui";
import {TextField} from "redux-form-material-ui"
import DateField from "../../sharedFormComponents/DateField";
import {Field, reduxForm} from "redux-form";
import {CancelButton, SubmitButton} from "../../../sharedComponents/StyledButtons";
import editIncidentDetails from "../../thunks/editIncidentDetails";

const IncidentDetailsDialog = (props) => (
    <Dialog
        open={props.dialogOpen}
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
                />
                <DateField
                    name='incidentDate'
                    label='Incident Date'
                    data-test="editIncidentDateField"
                    inputProps={{
                        "data-test": "editIncidentDateInput",
                        type: "date",
                        max: moment(Date.now()).format('YYYY-MM-DD')
                    }}
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
                />
            </form>
        </DialogContent>
        <DialogActions>
            <CancelButton
                data-test="cancelEditIncidentDetailsButton"
                onClick={props.handleDialogClose}
            >
                Cancel
            </CancelButton>
            <SubmitButton
                data-test="saveIncidentDetailsButton"
                onClick={props.handleSubmit((values, dispatch, props) =>
                    dispatch(editIncidentDetails({
                            ...values,
                            id: props.caseId
                        },
                        props.handleDialogClose
                    )))}
            >
                Save
            </SubmitButton>
        </DialogActions>
    </Dialog>
)

export default reduxForm({ form: 'IncidentDetails' })(IncidentDetailsDialog)