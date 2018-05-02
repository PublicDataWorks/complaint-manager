import validator from "validator";

const isRequired = text => value => {
    return value ? undefined : `Please enter ${text}`
}

const notBlank = text => value =>
    value.trim() === '' ? `Please enter ${text}` : undefined

export const isPhoneNumber = value => {
    const missingOrValid = !Boolean(value) || /^[0-9]{10}$/.test(value)
    return missingOrValid ? undefined : 'Please enter a numeric 10 digit value'
}

export const isEmail = value => {
    const missingOrValid = !Boolean(value) || validator.isEmail(value)
    return missingOrValid ? undefined : 'Please enter a valid email address'
}

export const notFutureDate = value => {
    const today = new Date(Date.now())
    const chosenDate = new Date(value)

    return (chosenDate.getTime() > today.getTime() ? `Date cannot be in the future` : undefined)

}

export const firstNameRequired = isRequired('First Name');
export const lastNameRequired = isRequired('Last Name');
export const firstNameNotBlank = notBlank('First Name')
export const lastNameNotBlank = notBlank('Last Name')
export const emailIsRequired = isRequired('Email Address')
export const genderIdentityIsRequired = isRequired('Gender Identity')
export const raceEthnicityIsRequired = isRequired('Race/Ethnicity')
export const actionIsRequired = isRequired('Action')

