import React from 'react'
import { FormControl, FormHelperText, InputLabel, MenuItem } from 'material-ui'
import {Select} from 'redux-form-material-ui'

const IncidentTypeSelect = (props) => {

    return (
        <FormControl error={props.meta.touched && props.meta.error !== undefined}>
            <InputLabel htmlFor="incidentType">
                Incident Type
            </InputLabel>
            <Select
                {...props}
            >
                <MenuItem
                    value="Citizen Complaint"
                    data-test="citizenComplaintItem"
                >
                    Citizen Complaint
                </MenuItem>
                <MenuItem
                    value="Officer Complaint"
                    data-test="officerComplaintItem"
                >
                    Officer Complaint
                </MenuItem>
                <MenuItem
                    value="Criminal Liaison Case"
                    data-test="criminalLiaisonItem"
                >
                    Criminal Liaison Case
                </MenuItem>
                <MenuItem
                    value="Commendation"
                    data-test="commendationItem"
                >
                    Commendation
                </MenuItem>
            </Select>
            <FormHelperText>
                {props.meta.touched && props.meta.error}
            </FormHelperText>
        </FormControl>
    )}

export default IncidentTypeSelect