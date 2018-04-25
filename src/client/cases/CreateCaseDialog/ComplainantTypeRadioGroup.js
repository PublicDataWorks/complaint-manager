import React from 'react'
import {FormControl, FormControlLabel, FormLabel, Radio, Typography} from 'material-ui'
import {RadioGroup} from 'redux-form-material-ui'

const ComplainantTypeRadioGroup = (props) => (
    <FormControl>
        <Typography variant='body2' style={{marginBottom: '8px'}}>Complainant Information</Typography>
        <FormLabel>The complainant is a...</FormLabel>
        <RadioGroup {...props}>
            <FormControlLabel value="Civilian" control={<Radio color="primary"/>} label="Civilian" />
        </RadioGroup>
    </FormControl>
)

export default ComplainantTypeRadioGroup