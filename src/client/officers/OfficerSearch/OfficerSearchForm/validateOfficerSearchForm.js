import {atLeastOneRequired} from "../../../formValidations";

const validate = (values) => {
    const includesInvalidCharMessage = "Please note that % and _ are not allowed";
    const fieldTooShortMessage = "Please enter at least two characters";

    const errors = atLeastOneRequired(values, "Please complete at least one field", ['firstName', 'lastName', 'district']);

    if (includesInvalidCharacter(values.firstName)) {
        errors.firstName = includesInvalidCharMessage;
    } else if (fieldTooShort(values.firstName)) {
        errors.firstName = fieldTooShortMessage;
    }

    if (includesInvalidCharacter(values.lastName)) {
        errors.lastName = includesInvalidCharMessage;
    } else if (fieldTooShort(values.lastName)) {
        errors.lastName = fieldTooShortMessage;
    }

    return errors;
};

const fieldTooShort = (value) => {
    const minLength = 2;
    return !!value && (value.trim().length < minLength);
};

const includesInvalidCharacter = (value) => {
    return value && ( value.includes('%') || value.includes('_') );
}
export default validate;