import React from 'react'
import {FormControl, FormControlLabel, Radio} from "material-ui";
import {RadioGroup} from 'redux-form-material-ui'
const OfficerTypeRadioGroup = (props) => (
    <FormControl>
        <RadioGroup {...props}>
            <FormControlLabel control={<Radio/>} label="Accused" value="Accused"/>
        </RadioGroup>
    </FormControl>
)

export default OfficerTypeRadioGroup