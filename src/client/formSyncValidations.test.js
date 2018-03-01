import {atLeastOneRequired} from "./formSyncValidations";

describe('synchronous validations', () => {
    test('test phone number or email validation when flat object', () => {
        const testValues = {
            phoneNumber: '',
            email: ''
        }

        const expectedErrors = {
            phoneNumber: 'Please enter phone number or email address',
            email: 'Please enter phone number or email address'
        }

        const errors = atLeastOneRequired(testValues, 'Please enter phone number or email address', ['phoneNumber', 'email'])

        expect(errors).toEqual(expectedErrors)

    })


    test('test phone number or email validation when nested object', () => {
        const testValues = {
            civilian: {
                phoneNumber: '',
                email: ''
            }
        }

        const expectedErrors = {
            civilian: {
                phoneNumber: 'Please enter phone number or email address',
                email: 'Please enter phone number or email address'
            }
        }

        const errors = atLeastOneRequired(testValues, 'Please enter phone number or email address', ['civilian.phoneNumber', 'civilian.email'])

        expect(errors).toEqual(expectedErrors)
    })

    test('should not produce errors when one of the fields is provided', () => {
        const testValues = {
            phoneNumber: '',
            email: 'example@test.com'
        }
        const expectedErrors = {}

        const errors = atLeastOneRequired(testValues, 'Please enter phone number or email address', ['phoneNumber', 'email'])

        expect(errors).toEqual(expectedErrors)
    })
})