import React from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import TextField from '../formFields/TextField'
import createCase from "./thunks/createCase";

const CreateCaseForm = ({ handleSubmit }) => {
    return (
        <form data-test="createCaseForm" onSubmit={handleSubmit}>
            <Field
                InputProps={{
                    "data-test": "firstNameInput"
                }}
                name="firstName"
                label="First Name"
                component={TextField}
            />
            <Field
                InputProps={{
                    "data-test": "lastNameInput"
                }}
                name="lastName"
                label="Last Name"
                component={TextField}
            />
        </form>
    )
};

const connectedForm = connect()(CreateCaseForm)

const dispatchCreateCase = (values, dispatch) => {
    dispatch(createCase(values))
}
export default reduxForm({
    form: 'CreateCase',
    onSubmit: dispatchCreateCase
})(connectedForm);