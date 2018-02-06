import React from 'react';
import {Field} from 'redux-form';
import {TextField} from "redux-form-material-ui";
import {isEmail} from "../../formValidations";

const EmailField = () => (
    <Field
        name="email"
        component={TextField}
        label="Email"
        inputProps={{"data-test": "emailInput"}}
        data-test="emailField"
        validate={[isEmail]}
        style={{marginRight: '5%', marginBottom: '3%'}}
    />
)

export default EmailField