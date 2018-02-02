import React from 'react'
import {Provider} from 'react-redux'
import createConfiguredStore from "../../createConfiguredStore";
import {mount} from "enzyme/build/index";
import {createCaseSuccess } from "../actionCreators";
import CreateCaseDialog from "./CreateCaseDialog";
import {changeInput, expectEventuallyNotToExist, getDateFromDatePicker} from "../../../testHelpers";
import createCase from "../thunks/createCase";
import {openSnackbar} from "../../snackbar/actionCreators";
import moment from "moment";

jest.mock('../thunks/createCase', () => (creationDetails) => ({
    type: 'MOCK_CREATE_CASE_THUNK',
    creationDetails
}))

describe('CreateCaseDialog component', () => {
    let store, dialog, dispatchSpy

    beforeEach(() => {
        store = createConfiguredStore();

        dialog = mount(
            <Provider store={store}>
                <CreateCaseDialog/>
            </Provider>
        )

        dispatchSpy = jest.spyOn(store, 'dispatch')
        dispatchSpy.mockClear()

        const createCaseButton = dialog.find('button[data-test="createCaseButton"]')
        createCaseButton.simulate('click')
    })

    test('should dismiss visible snackbars when dialog opened', () => {
        store.dispatch(openSnackbar())
        const createCaseButton = dialog.find('button[data-test="createCaseButton"]')

        createCaseButton.simulate('click')

        expect(store.getState()).toHaveProperty('ui.snackbar.open', false)
    })

    describe('submitting a case', () => {
        let caseDetails

        beforeEach(() => {
            caseDetails = {
                firstName: 'Fats',
                lastName: 'Domino',
                phoneNumber: '0123456789',
                email: 'fdomino@gmail.com',
                complainantType: 'Civilian',
                incidentDate: moment(),
                firstContactDate: moment()
            }


            changeInput(dialog, '[data-test="firstNameInput"]', caseDetails.firstName);
            changeInput(dialog, '[data-test="lastNameInput"]', caseDetails.lastName);
            changeInput(dialog, '[data-test="phoneNumberInput"]', caseDetails.phoneNumber);
            changeInput(dialog, '[data-test="emailInput"]', caseDetails.email);
        });

        //TODO: See if Ed/Molly/Sebastian can help us debug these tests
        test.skip('should plan to redirect when clicking Create-And-View', () => {
            const submitButton = dialog.find('SubmitButton[data-test="createAndView"]')
            submitButton.simulate('click')

            expect(dispatchSpy).toHaveBeenCalledWith(createCase({caseDetails: caseDetails, redirect: true}))
        })

        //TODO: See if Ed/Molly/Sebastian can help us debug these tests
        test.skip('should create case when clicking Create Only', () => {
            const submitButton = dialog.find('LinkButton[data-test="createCaseOnly"]')
            submitButton.simulate('click')
            expect(dispatchSpy).toHaveBeenCalledWith({caseDetails: caseDetails, redirect: false})
        })
        
    })

    describe('dismissing dialog', () => {
        test('should dismiss when cancel button is clicked', async () => {
            const cancel = dialog.find('button[data-test="cancelCase"]')
            cancel.simulate('click')

            await expectEventuallyNotToExist(dialog, '[data-test="createCaseDialogTitle"]')
        })

        test('should dismiss after successful case creation', async () => {
            store.dispatch(createCaseSuccess({id: 1234}))

            await expectEventuallyNotToExist(dialog, '[data-test="createCaseDialogTitle"]')
        })
    })

    describe('fields', () => {
        describe('first name', () => {
            test('first name should have max length of 25 characters', () => {
                const firstName = dialog.find('input[data-test="firstNameInput"]')
                expect(firstName.props().maxLength).toEqual(25)
            })

            test('first name should not use autoComplete', () => {
                const firstName = dialog.find('input[data-test="firstNameInput"]')
                expect(firstName.props().autoComplete).toEqual('off')
            })
        });

        describe('last name', () => {
            test('last name should have max length of 25 characters', () => {
                const lastName = dialog.find('input[data-test="lastNameInput"]')
                expect(lastName.props().maxLength).toEqual(25)
            })

            test('last name should not use autoComplete', () => {
                const lastName = dialog.find('input[data-test="lastNameInput"]')
                expect(lastName.props().autoComplete).toEqual('off')
            })
        });

        describe('firstContactDatePicker', () => {
            test('should default date to current date', () => {
                const datePicker = dialog.find('[data-test="firstContactDateInput"]').last()
                expect(datePicker.instance().value).toEqual(moment(Date.now()).format("YYYY-MM-DD"))
            })

            test('should not change when changing to a future date', () => {
                const datePicker = dialog.find('[data-test="firstContactDateInput"]').last()
                const tomorrow = moment(Date.now()).add(2,'days').format("YYYY-MM-DD")
                datePicker.simulate('change', {target: {value:tomorrow.toString()}})

                const datePickerField = dialog.find('[data-test="firstContactDateField"]').first()
                datePickerField.simulate('blur')

                console.log(datePickerField.text())
                expect(datePickerField.text()).toContain('Date cannot be in the future')
            })

            test('should change when changing to a past date', () => {
                const datePicker = dialog.find('[data-test="firstContactDateInput"]').last()
                const yesterday = moment(Date.now()).subtract(1,'days').format("YYYY-MM-DD")
                datePicker.simulate('change', {target: {value:yesterday}})

                expect(datePicker.instance().value).toEqual(yesterday)
            })
        });
    })

    describe('field validation', () => {
        let submitButton
        beforeEach(() => {
            submitButton = dialog.find('LinkButton[data-test="createCaseOnly"]')
        })

        describe('first name', () => {
            test('should display error message on submit when no value', () => {
                const firstNameField = dialog.find('div[data-test="firstNameField"]')
                submitButton.simulate('click')
                expect(firstNameField.text()).toContain('Please enter First Name')
            })

            test('should display error message when no value and clicked on and off', () => {
                const firstNameField = dialog.find('div[data-test="firstNameField"]')
                const firstNameInput = dialog.find('input[data-test="firstNameInput"]')
                firstNameInput.simulate('focus')
                firstNameInput.simulate('blur')
                expect(firstNameField.text()).toContain('Please enter First Name')
            })

            test('should display error when whitespace', () => {
                const firstNameInput = dialog.find('input[data-test="firstNameInput"]')

                firstNameInput.simulate('focus')
                firstNameInput.simulate('change', {target: {value: '   '}})
                firstNameInput.simulate('blur')

                const firstNameField = dialog.find('div[data-test="firstNameField"]')
                expect(firstNameField.text()).toContain('Please enter First Name')
            })
        })

        describe('last name', () => {
            test('should display error message when no value', () => {
                const lastNameField = dialog.find('div[data-test="lastNameField"]')
                submitButton.simulate('click')
                expect(lastNameField.text()).toContain('Please enter Last Name')
            })

            test('should display error message when no value and clicked on and off', () => {
                const lastNameField = dialog.find('div[data-test="lastNameField"]')
                const lastNameInput = dialog.find('input[data-test="lastNameInput"]')
                lastNameInput.simulate('focus')
                lastNameInput.simulate('blur')
                expect(lastNameField.text()).toContain('Please enter Last Name')
            })

            test('should display error when whitespace', () => {
                const lastNameInput = dialog.find('input[data-test="lastNameInput"]')

                lastNameInput.simulate('focus')
                lastNameInput.simulate('change', {target: {value: '\t\t   '}})
                lastNameInput.simulate('blur')

                const lastNameField = dialog.find('div[data-test="lastNameField"]')
                expect(lastNameField.text()).toContain('Please enter Last Name')
            })
        });

        describe('phone number', () => {
            test('should display error when phone number validation fails', () => {
                const phoneNumberInput = dialog.find('input[data-test="phoneNumberInput"]')

                phoneNumberInput.simulate('focus')
                phoneNumberInput.simulate('change', {target: {value: 'bad-number'}})
                phoneNumberInput.simulate('blur')

                const phoneNumberField = dialog.find('div[data-test="phoneNumberField"]')
                expect(phoneNumberField.text()).toContain('Please enter a numeric 10 digit value')
            })

            test('should not display error when nothing was entered (Will prompt for email or phone number instead)', () => {
                submitButton.simulate('click')

                const phoneNumberField = dialog.find('div[data-test="phoneNumberField"]')
                expect(phoneNumberField.text()).not.toContain('Please enter a numeric 10 digit value')
            })
        });

        describe('email', () => {
            test('should display error when not an email address', () => {
                const emailInput = dialog.find('input[data-test="emailInput"]')

                emailInput.simulate('focus')
                emailInput.simulate('change', {target: {value: 'ethome@thoughtworks'}})
                emailInput.simulate('blur')

                const emailField = dialog.find('div[data-test="emailField"]')
                expect(emailField.text()).toContain('Please enter a valid email address')
            })
        });

        describe('when email and phone number are undefined', () => {
            test('should display phone number error', () => {
                submitButton.simulate('click')
                const phoneNumberField = dialog.find('div[data-test="phoneNumberField"]')
                expect(phoneNumberField.text()).toContain('Please enter phone number or email address')
            })

            test('should display email error', () => {
                submitButton.simulate('click')
                const emailField = dialog.find('div[data-test="emailField"]')
                expect(emailField.text()).toContain('Please enter phone number or email address')
            })

            test("should not ask for phone number or email when email has been properly submitted", () => {
                const emailInput = dialog.find('input[data-test="emailInput"]')

                emailInput.simulate('focus')
                emailInput.simulate('change', {target: {value: 'ethome@thoughtworks'}})
                emailInput.simulate('blur')

                const phoneNumberField = dialog.find('div[data-test="phoneNumberField"]')
                const emailField = dialog.find('div[data-test="emailField"]')

                submitButton.simulate('click')

                expect(phoneNumberField.text()).not.toContain('Please enter phone number or email address')
                expect(emailField.text()).not.toContain('Please enter phone number or email address')
            })

            test("should not ask for phone number or email when phone number has been properly submitted", () => {
                const phoneNumberInput = dialog.find('input[data-test="phoneNumberInput"]')

                phoneNumberInput.simulate('focus')
                phoneNumberInput.simulate('change', {target: {value: '0123456789'}})
                phoneNumberInput.simulate('blur')

                const phoneNumberField = dialog.find('div[data-test="phoneNumberField"]')
                const emailField = dialog.find('div[data-test="emailField"]')

                submitButton.simulate('click')

                expect(phoneNumberField.text()).not.toContain('Please enter phone number or email address')
                expect(emailField.text()).not.toContain('Please enter phone number or email address')
            })
        })
    })

    //TODO: See if Ed/Molly/Sebastian can help us debug these tests
    describe('trimming whitespace', () => {
        test.skip('whitespace should be trimmed from fields prior to sending', () => {
            changeInput(dialog, 'input[data-test="firstNameInput"]', '   Hello   ')
            changeInput(dialog, 'input[data-test="lastNameInput"]', '   Kitty   ')
            changeInput(dialog, 'input[data-test="phoneNumberInput"]', '1234567890')

            const submitButton = dialog.find('LinkButton[data-test="createCaseOnly"]')
            submitButton.simulate('click')

            expect(dispatchSpy).toHaveBeenCalledWith(
                createCase({
                    firstName: 'Hello',
                    lastName: 'Kitty',
                    phoneNumber: '1234567890',
                    complainantType: 'Civilian'
                }))
        })
    })
})