import React from 'react';
import {Provider} from 'react-redux';
import {reduxForm} from 'redux-form';
import {mount} from "enzyme/build/index";
import createConfiguredStore from "../../createConfiguredStore";
import EmailField from "./EmailField";

describe(('Email field'), () => {
    let emailFieldComponent
    
    beforeEach(() => {
        const ReduxFormField = reduxForm({form: "testForm"})(EmailField)
        const store = createConfiguredStore()
        emailFieldComponent = mount(<Provider store={store}><ReduxFormField/></Provider>)
    })
    
    test('should display error when not an email address', () => {
        const emailInput = emailFieldComponent.find('input[data-test="emailInput"]')

        emailInput.simulate('focus')
        emailInput.simulate('change', {target: {value: 'ethome@thoughtworks'}})
        emailInput.simulate('blur')

        const emailField = emailFieldComponent.find('div[data-test="emailField"]')
        expect(emailField.text()).toContain('Please enter a valid email address')
    })
})