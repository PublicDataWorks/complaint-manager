import React from 'react';
import {Field} from 'redux-form';
import {TextField} from "redux-form-material-ui";
import {firstNameRequired, firstNameNotBlank} from "../../formValidations";

const FirstNameField = () => (
    <Field
        required
        name="firstName"
        component={TextField}
        label="First Name"
        inputProps={{
            maxLength: 25, 
            autoComplete: "off",
            "data-test": "firstNameInput"
        }}
        data-test="firstNameField"
        validate={[firstNameRequired, firstNameNotBlank]}
        style={{marginRight: '5%', marginBottom: '3%'}}
    />
)

export default FirstNameField