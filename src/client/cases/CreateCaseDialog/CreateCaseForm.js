import React from 'react';
import {Field, reduxForm} from 'redux-form'
import createCase from "../thunks/createCase";
import {TextField} from 'redux-form-material-ui'

const CreateCaseForm = () => {
    const offSet = {
        marginRight: '5%'
    }

    return (
        <form data-test="createCaseForm">
            <Field
                name="firstName"
                component={TextField}
                label="First Name"
                inputProps={{
                    maxLength: 25,
                    autoComplete: "off",
                    "data-test": "firstNameInput"
                }}
                style={offSet}
            />
            <Field
                name="lastName"
                component={TextField}
                label="Last Name"
                inputProps={{
                    maxLength: 25,
                    autoComplete: "off",
                    "data-test": "lastNameInput"
                }}
                style={offSet}
            />
            <Field
                name="phoneNumber"
                component={TextField}
                label="Phone Number"
                inputProps={{
                    "data-test": "phoneNumberInput"
                }}
                style={offSet}
            />
            <Field
                name="email"
                component={TextField}
                label="Email"
                inputProps={{
                    "data-test": "emailInput",
                }}
                style={offSet}
            />
        </form>
    )
}

const trimIfString = (value) => {
    if (typeof value === 'string') {
        return value.trim()
    }
    return value
}

const dispatchCreateCase = (values, dispatch) => {
    values.firstName = trimIfString(values.firstName)
    values.lastName = trimIfString(values.lastName)

    dispatch(createCase(values))
}

export default reduxForm({
    form: 'CreateCase',
    onSubmit: dispatchCreateCase
})(CreateCaseForm);