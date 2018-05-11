import React from 'react';
import {FormControl, FormControlLabel, Radio, Typography, withStyles} from 'material-ui';
import {RadioGroup} from 'redux-form-material-ui';

const styles = {
    radio: {
        marginRight: "48px"
    }
}

const RoleOnCaseRadioGroup = ({ classes, ...other }) => (
    <FormControl>
        <Typography variant='body2' style={{marginBottom: '8px'}}>Role On Case</Typography>
        <RadioGroup
            {...other}
            style={{flexDirection: "row", marginBottom: '24px'}}
            data-test="roleOnCaseRadioGroup"
        >
            <FormControlLabel
                className={classes.radio}
                value="Complainant"
                control={<Radio color="primary"/>}
                label="Complainant" />
            <FormControlLabel
                className={classes.radio}
                value="Witness"
                control={<Radio color="primary"/>}
                label="Witness"
            />
        </RadioGroup>
    </FormControl>
)

export default withStyles(styles)(RoleOnCaseRadioGroup)