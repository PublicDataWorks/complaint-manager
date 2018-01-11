import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import createUser from '../thunks/createUser'

const CreateUserForm = () => {
    return (
        <form data-test="createUserForm">
            <Field
                name="firstName"
                component={TextField}
                label="First Name"
                inputProps={{
                    "data-test": "firstNameInput"
                }}
            />
            <Field
                name="lastName"
                component={TextField}
                label="Last Name"
                inputProps={{
                    "data-test": "lastNameInput"
                }}
            />
            <Field
                name="email"
                component={TextField}
                label="Email"
                inputProps={{
                    "data-test": "emailInput"
                }}
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