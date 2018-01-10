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
                component={TextFieldWrapper}
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
                component={TextFieldWrapper}
                label="Last Name"
                inputProps={{
                    maxLength: 25,
                    autoComplete: "off",
                    "data-test": "lastNameInput"
                }}
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