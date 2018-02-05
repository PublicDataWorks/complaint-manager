import React from 'react';
import {FormControl, FormControlLabel, Radio, Typography} from 'material-ui';
import {RadioGroup} from 'redux-form-material-ui';

const RoleOnCaseRadioGroup = (props) => (
    <FormControl>
        <Typography type='body2' style={{marginBottom: '8px'}}>Role On Case</Typography>
        <RadioGroup {...props} data-test="roleOnCaseRadioGroup">
            <FormControlLabel value="primaryComplainant" control={<Radio />} label="Primary Complainant" />
        </RadioGroup>
    </FormControl>
)

export default RoleOnCaseRadioGroup