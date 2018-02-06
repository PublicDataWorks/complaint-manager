import React from 'react';
import {Field} from 'redux-form';
import {TextField} from "redux-form-material-ui";
import {isPhoneNumber} from "../../formValidations";

const PhoneNumberField = () => (
    <Field
        name="phoneNumber"
        component={TextField}
        label="Phone Number"
        inputProps={{
            "data-test": "phoneNumberInput"}}
        data-test="phoneNumberField"
        validate={[isPhoneNumber]}
        style={{marginRight: '5%', marginBottom: '3%'}}
    />
)

export default PhoneNumberField