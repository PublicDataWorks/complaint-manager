import React from 'react'
import { Field, reduxForm } from 'redux-form'
import TextFieldWrapper from '../formFields/TextFieldWrapper'
import createUser from './thunks/createUser'

const CreateUserForm = () => {
    return (
        <form data-test="createUserForm">
            <Field
                name="firstName"
                label="First Name"
                InputProps={{
                    "data-test": "firstNameInput"
                }}
                component={TextFieldWrapper}
            />
            <Field
                InputProps={{
                    "data-test": "lastNameInput"
                }}
                name="lastName"
                label="Last Name"
                component={TextFieldWrapper}
            />
            <Field
                InputProps={{
                    "data-test": "emailInput"
                }}
                name="email"
                label="Email"
                component={TextFieldWrapper}
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