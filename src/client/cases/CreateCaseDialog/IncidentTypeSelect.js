import React from 'react'
import { FormControl, FormHelperText, Input, InputLabel, MenuItem } from 'material-ui'
import {Select} from 'redux-form-material-ui'

const IncidentTypeSelect = (props) => {
    console.log('props', props)

    const newProps = {
        ...props,
        input: {
            ...props.input,
            value: props.input.value === undefined ? '' : props.input.value,
            onChange: event => {
                console.log('inside onChange')
                console.log('event', event)
                props.input.onChange(event);
            },
            onBlur: () => {
                console.log('inside onBlur')
                props.input.onBlur()
            }
        }
    }

    return (
        <FormControl error={props.meta.error !== undefined}>
            <InputLabel htmlFor="incidentType">
                Incident Type
            </InputLabel>
            <Select
                value=''
                input={<Input id="incidentType" />}
                {...newProps}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value="Citizen Complaint">
                    Citizen Complaint
                </MenuItem>
                <MenuItem value="Officer Complaint">
                    Officer Complaint
                </MenuItem>
                <MenuItem value="Criminal Liaison Case">
                    Criminal Liaison Case
                </MenuItem>
                <MenuItem value="Commendation">
                    Commendation
                </MenuItem>
            </Select>
            <FormHelperText>{props.meta.error}</FormHelperText>
        </FormControl>
    )}

export default IncidentTypeSelect