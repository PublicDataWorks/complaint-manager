import CreateUserForm from "./CreateUserForm";
import {mount} from "enzyme";
import React from 'react'
import {Provider} from 'react-redux'
import createConfiguredStore from "../../createConfiguredStore";


describe('field validation', () => {
    let store, form, dispatchSpy

    beforeEach(() => {
        store = createConfiguredStore();

        form = mount(
            <Provider store={store}>
                <CreateUserForm/>
            </Provider>)

    })

    describe("first name validations", () => {

        test('should display error message on blur if first name is not provided', () => {
            const firstNameInput = form.find('input[data-test="firstNameInput"]')

            firstNameInput.simulate('focus')
            firstNameInput.simulate('change', {target: {value: ''}})
            firstNameInput.simulate('blur')

            const firstNameField = form.find('div[data-test="firstNameField"]')
            expect(firstNameField.text()).toContain('Please enter First Name')
        })

        test('should display error message on blur if first name is blank', () => {
            const firstNameInput = form.find('input[data-test="firstNameInput"]')

            firstNameInput.simulate('focus')
            firstNameInput.simulate('change', {target: {value: '\n'}})
            firstNameInput.simulate('blur')

            const firstNameField = form.find('div[data-test="firstNameField"]')
            expect(firstNameField.text()).toContain('Please enter First Name')
        })

        test('should not display error message on blur if first name is present', () => {
            const firstNameInput = form.find('input[data-test="firstNameInput"]')

            firstNameInput.simulate('focus')
            firstNameInput.simulate('change', {target: {value: 'Brain'}})
            firstNameInput.simulate('blur')

            const firstNameField = form.find('div[data-test="firstNameField"]')
            expect(firstNameField.text()).not.toContain('Please enter First Name')
        })

        test('first name should have max length of 25 characters', () => {
            const firstName = form.find('input[data-test="firstNameInput"]')
            expect(firstName.props().maxLength).toEqual(25)
        })
    })

    describe("last name validations", () => {
        test('should display error message on blur if last name is not provided', () => {
            const lastNameInput = form.find('input[data-test="lastNameInput"]')

            lastNameInput.simulate('focus')
            lastNameInput.simulate('change', {target: {value: ''}})
            lastNameInput.simulate('blur')

            const lastNameField = form.find('div[data-test="lastNameField"]')
            expect(lastNameField.text()).toContain('Please enter Last Name')
        })

        test('should display error message on blur if last name is blank', () => {
            const lastNameInput = form.find('input[data-test="lastNameInput"]')

            lastNameInput.simulate('focus')
            lastNameInput.simulate('change', {target: {value: '\n'}})
            lastNameInput.simulate('blur')

            const lastNameField = form.find('div[data-test="lastNameField"]')
            expect(lastNameField.text()).toContain('Please enter Last Name')
        })

        test('should not display error message on blur if last name is present', () => {
            const lastNameInput = form.find('input[data-test="lastNameInput"]')

            lastNameInput.simulate('focus')
            lastNameInput.simulate('change', {target: {value: 'Brain'}})
            lastNameInput.simulate('blur')

            const lastNameField = form.find('div[data-test="lastNameField"]')
            expect(lastNameField.text()).not.toContain('Please enter Last Name')
        })

        test('last name should have max length of 25 characters', () => {
            const lastName = form.find('input[data-test="lastNameInput"]')
            expect(lastName.props().maxLength).toEqual(25)
        })
    })

    describe("email name validations", () => {
        test("should display error if email is not provided", () => {
            const emailInput = form.find('input[data-test="emailInput"]')

            emailInput.simulate('focus')
            emailInput.simulate('change', {target: {value: ''}})
            emailInput.simulate('blur')

            const emailField = form.find('div[data-test="emailField"]')
            expect(emailField.text()).toContain('Please enter Email Address')
        })
        test("should not display error if email is provided", () => {
            const emailInput = form.find('input[data-test="emailInput"]')

            emailInput.simulate('focus')
            emailInput.simulate('change', {target: {value: 'brain@thoughtworks.com'}})
            emailInput.simulate('blur')

            const emailField = form.find('div[data-test="emailField"]')
            expect(emailField.text()).not.toContain('Please enter a valid email address')
        })
        test("should display error if email is formatted improperly", () => {
            const emailInput = form.find('input[data-test="emailInput"]')

            emailInput.simulate('focus')
            emailInput.simulate('change', {target: {value: 'derpderp'}})
            emailInput.simulate('blur')

            const emailField = form.find('div[data-test="emailField"]')
            expect(emailField.text()).toContain('Please enter a valid email address')
        })
    })
})