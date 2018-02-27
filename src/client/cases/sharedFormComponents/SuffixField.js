import React from 'react'
import {Field} from "redux-form";
import {TextField} from "redux-form-material-ui";

const SuffixField = (props) => (
    <Field
        {...props}
        inputProps={{
            "data-test": "suffixInput",
            maxLength: 25
        }}
        data-test="suffixField"
        label='Suffix'
        component={TextField}
        normalize={(value, previousValue) => (
            value === "" || /^([^#/])*$/.test(value) ? value : previousValue
        )}
    />
)

export default SuffixField