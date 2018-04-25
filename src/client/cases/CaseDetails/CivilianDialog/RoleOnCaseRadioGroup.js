import React from 'react';
import {FormControl, FormControlLabel, Radio, Typography} from 'material-ui';
import {RadioGroup} from 'redux-form-material-ui';

const RoleOnCaseRadioGroup = (props) => (
    <FormControl>
        <Typography variant='body2' style={{marginBottom: '8px'}}>Role On Case</Typography>
        <RadioGroup
            {...props}
            style={{flexDirection: "row", marginBottom: '24px'}}
            data-test="roleOnCaseRadioGroup"
        >
            <FormControlLabel
                value="Complainant"
                control={<Radio color="primary"/>}
                label="Complainant" />
            <FormControlLabel
                value="Witness"
                control={<Radio color="primary"/>}
                label="Witness"
            />
        </RadioGroup>
    </FormControl>
)

export default RoleOnCaseRadioGroup