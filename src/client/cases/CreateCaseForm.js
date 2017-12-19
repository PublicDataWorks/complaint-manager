import React from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { createCase } from './actionCreators'
import TextField from '../formFields/TextField'

const CreateCaseForm = ({ handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
            <Field
                data-test="firstNameInput"
                name="firstName"
                label="First Name"
                component={TextField}
            />
            <Field
                data-test="lastNameInput"
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