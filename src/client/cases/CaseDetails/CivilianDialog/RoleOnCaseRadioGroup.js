import React from 'react';
import {FormControl, FormControlLabel, Radio, Typography} from 'material-ui';
import {RadioGroup} from 'redux-form-material-ui';

const RoleOnCaseRadioGroup = (props) => (
    <FormControl>
        <Typography type='body2' style={{marginBottom: '8px'}}>Role On Case</Typography>
        <RadioGroup
            {...props}
            style={{flexDirection: "row", marginBottom: '24px'}}
            data-test="roleOnCaseRadioGroup"
        >
            <FormControlLabel
                value="Complainant"
                control={<Radio />}
                label="Complainant" />
            <FormControlLabel
                value="Witness"
                control={<Radio/>}
                label="Witness"
            />
        </RadioGroup>
    </FormControl>
)

export default RoleOnCaseRadioGroup