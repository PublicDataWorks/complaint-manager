import {
    emailIsRequired,
    firstNameNotBlank, firstNameRequired, isEmail, isPhoneNumber, lastNameNotBlank,
    lastNameRequired, notFutureDate, validDate
} from "./formValidations";
import moment from "moment";

describe('Form Validations', () => {
    test("firstNameRequired should return an error message when undefined", () => {
        expect(firstNameRequired()).toEqual("Please enter First Name")
    })
    test("firstNameRequired should not return an error message when a name is submitted", () => {
        expect(firstNameRequired("Archibald")).toBeUndefined()
    })

    test("lastNameRequired should return an error message when undefined", () => {
        expect(lastNameRequired()).toEqual("Please enter Last Name")
    })
    test("lastNameRequired should not return an error message when a name is submitted", () => {
        expect(lastNameRequired("Friedreichsdottir")).toBeUndefined()
    })

    test("firstNameRequired should return an error message when blank", () => {
        expect(firstNameNotBlank("")).toEqual("Please enter First Name")
        expect(firstNameNotBlank("\n")).toEqual("Please enter First Name")
    })
    test("firstNameRequired should not return an error message when a name is submitted", () => {
        expect(firstNameNotBlank("Ulysses")).toBeUndefined()
    })

    test("lastNameRequired should return an error message when blank", () => {
        expect(lastNameNotBlank("")).toEqual("Please enter Last Name")
        expect(lastNameNotBlank("\n")).toEqual("Please enter Last Name")
    })
    test("lastNameRequired should not return an error message when a name is submitted", () => {
        expect(lastNameNotBlank("Kozakiewicz")).toBeUndefined()
    })

    test("isEmail should return an error message when not in something@domain.suffix format", () => {
        expect(isEmail("bad-email")).toEqual("Please enter a valid email address")
    })
    test("isEmail should not return an error message when in something@domain.suffix format", () => {
        expect(isEmail("email@domain.edu")).toBeUndefined()
    })

    test("isPhoneNumber should return an error message when not 10 digit format", () => {
        expect(isPhoneNumber("123456789")).toEqual("Please enter a numeric 10 digit value")
        expect(isPhoneNumber("12345678901")).toEqual("Please enter a numeric 10 digit value")
    })
    test("isPhoneNumber should not return an error message when has 10 digits", () => {
        expect(isPhoneNumber("3134655245")).toBeUndefined()
    })

    test("emailRequired should return an error when email is not provided", () => {
        expect(emailIsRequired()).toEqual("Please enter Email Address")
    })

    test('notFutureDate should return an error when date is a future date', () => {
        const today = moment(Date.now()).add(1, 'days').format('YYYY-MM-DD')
        expect(notFutureDate(today)).toEqual('Date cannot be in the future')
    })
})
