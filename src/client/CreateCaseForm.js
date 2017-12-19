import React from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { createCase } from './actionCreators'

const CreateCaseForm = ({ handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div data-test="caseModalInstructions">
                Enter as much information as available to start a case. You will be able to edit this
                information later.
            </div>
            <Field
                name="firstName"
                component="input"
                type="text"
            />
            <Field
                name="lastName"
                component="input"
                type="text"
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