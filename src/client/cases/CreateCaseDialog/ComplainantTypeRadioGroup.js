import React from 'react'
import {FormControl, FormControlLabel, FormLabel, Radio, Typography} from 'material-ui'
import {RadioGroup} from 'redux-form-material-ui'

const ComplainantTypeRadioGroup = (props) => (
    <FormControl>
        <Typography type='body2' style={{marginBottom: '8px'}}>Complainant Information</Typography>
        <FormLabel>The primary complainant is a...</FormLabel>
        <RadioGroup {...props}>
            <FormControlLabel value="Civilian" control={<Radio />} label="Civilian" />
        </RadioGroup>
    </FormControl>
)

export default ComplainantTypeRadioGroup