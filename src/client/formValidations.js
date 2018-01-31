import validator from "validator";
import moment from "moment";

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

export const notFutureDate = value => {
    const today = new Date(Date.now())
    const chosenDate = new Date(value)

    return (chosenDate.getTime() > today.getTime() ? `Please enter a valid date` : undefined)

}

export const validDate = value => {
    const parsedDate = moment(value).toDate()
    if (!Boolean(parsedDate)) {
        return `Please enter a valid date`
    }

    const chosen = value.split('-')
    const chosenYear = parseInt(chosen[0], 10)
    const chosenMonth = parseInt(chosen[1], 10)
    const chosenDate = parseInt(chosen[2],10)

    return (
        chosenYear=== parsedDate.getFullYear()
        && chosenMonth === (parsedDate.getMonth()+1)
        && chosenDate=== parsedDate.getDate()
            ? undefined
            : `Please enter a valid date`
    )
}

export const firstNameRequired = isRequired('First Name');
export const lastNameRequired = isRequired('Last Name');
export const firstNameNotBlank = notBlank('First Name')
export const lastNameNotBlank = notBlank('Last Name')
export const emailIsRequired = isRequired('Email Address')

