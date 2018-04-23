import {atLeastOneRequired} from "../../../formValidations";

const validate = (values) => {
    const errors = atLeastOneRequired(values, "Please complete at least one field", ['firstName', 'lastName', 'district']);

    if (fieldTooShort(values.firstName)) {
        errors.firstName = "Please enter at least two characters"
    }
    if (fieldTooShort(values.lastName)) {
        errors.lastName = "Please enter at least two characters"
    }
    return errors;
};

const fieldTooShort = (value) => {
    const minLength = 2;
    return !!value && (value.trim().length < minLength);
};

export default validate;