import validator from "validator";

const isRequired = text => value =>
    value === undefined ? `Please enter ${text}` : undefined

const notBlank = text => value =>
    value.trim() === '' ? `Please enter ${text}` : undefined

export const isPhoneNumber = value => {
    const missingOrValid = value === undefined || /^[0-9]{10}$/.test(value);
    return missingOrValid ? undefined : 'Please enter a numeric 10 digit value'
}

export const isEmail = value => {
    const missingOrValid = value === undefined || validator.isEmail(value);
    return missingOrValid ? undefined : 'Please enter a valid email address'
}

export const firstNameRequired = isRequired('First Name');
export const lastNameRequired = isRequired('Last Name');
export const firstNameNotBlank = notBlank('First Name')
export const lastNameNotBlank = notBlank('Last Name')
export const emailIsRequired = isRequired('Email Address')
