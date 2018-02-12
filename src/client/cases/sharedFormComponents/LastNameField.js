import React from 'react';
import {Field} from 'redux-form';
import {TextField} from "redux-form-material-ui";
import {lastNameRequired, lastNameNotBlank} from "../../formValidations";

const LastNameField = (props) => (
    <Field
        required
        name={props.name}
        component={TextField}
        label="Last Name"
        inputProps={{
            maxLength: 25,
            autoComplete: "off",
            "data-test": "lastNameInput"}}
        data-test="lastNameField"
        validate={[lastNameRequired, lastNameNotBlank]}
        style={{marginRight: '5%', marginBottom: '3%'}}
    />
)

export default LastNameField
    
