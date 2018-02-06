import React from 'react';
import LastNameField from "./LastNameField";
import createConfiguredStore from "../../createConfiguredStore";
import {Provider} from 'react-redux';
import {reduxForm} from 'redux-form';
import {mount} from "enzyme/build/index";

describe('Last Name field', () => {
    let lastNameField;
    
    beforeEach(() => {
        const ReduxFormField = reduxForm({form: "testForm"})(LastNameField)
        const store = createConfiguredStore()
        lastNameField = mount(<Provider store={store}><ReduxFormField/></Provider>)    
    })

    test('last name should have max length of 25 characters', () => {
        const lastName = lastNameField.find('input[data-test="lastNameInput"]')
        expect(lastName.props().maxLength).toEqual(25)
    })

    test('last name should not use autoComplete', () => {
        const lastName = lastNameField.find('input[data-test="lastNameInput"]')
        expect(lastName.props().autoComplete).toEqual('off')
    })
})