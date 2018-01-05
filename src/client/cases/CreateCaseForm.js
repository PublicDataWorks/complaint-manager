import React from 'react';
import { Field, reduxForm } from 'redux-form'
import TextFieldWrapper from '../formFields/TextFieldWrapper'
import createCase from "./thunks/createCase";

const CreateCaseForm = () => {
    const offSet = {
        marginRight: '5%'
    }

    return (
        <form data-test="createCaseForm">
            <Field
                name="firstName"
                label="First Name"
                InputProps={{
                    "data-test": "firstNameInput"
                }}
                component={TextFieldWrapper}
                style={offSet}
            />
            <Field
                InputProps={{
                    "data-test": "lastNameInput"
                }}
                name="lastName"
                label="Last Name"
                component={TextFieldWrapper}
                style={offSet}
            />
        </form>
    )
};

const dispatchCreateCase = (values, dispatch) => {
    dispatch(createCase(values))
}

export default reduxForm({
    form: 'CreateCase',
    onSubmit: dispatchCreateCase
})(CreateCaseForm);