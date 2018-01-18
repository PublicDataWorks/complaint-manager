import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import createUser from '../thunks/createUser'
import {
    emailIsRequired,
    firstNameNotBlank,
    firstNameRequired,
    isEmail,
    lastNameNotBlank,
    lastNameRequired
} from "../../formValidations";

const CreateUserForm = () => {
    const offSet = {
        marginRight: '5%'
    }
    return (
        <form data-test="createUserForm">
            <Field
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
                data-test="lastNameField"
                validate={[lastNameRequired, lastNameNotBlank]}
                style={offSet}
            />
            <Field
                name="email"
                component={TextField}
                label="Email"
                inputProps={{
                    "data-test": "emailInput",
                }}
                data-test="emailField"
                validate={[emailIsRequired, isEmail]}
                style={offSet}
            />
        </form>
    )
}

const dispatchCreateUser = (values, dispatch) => {
    dispatch(createUser(values))
}

export default reduxForm({
    form: 'CreateUser',
    onSubmit: dispatchCreateUser
})(CreateUserForm);