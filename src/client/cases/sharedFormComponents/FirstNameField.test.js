import React from 'react';
import FirstNameField from "./FirstNameField";
import {Provider} from 'react-redux';
import {reduxForm} from 'redux-form';
import {mount} from "enzyme/build/index";
import createConfiguredStore from "../../createConfiguredStore";

describe('First name field', () => {
    let firstNameField;

    beforeEach(() => {
        const ReduxFormField = reduxForm({form: "testForm"})(() => <FirstNameField name={'firstName'}/>)
        const store = createConfiguredStore()
        firstNameField = mount(<Provider store={store}><ReduxFormField/></Provider>)
    })
    
    test('first name should have max length of 25 characters', () => {
        const firstName = firstNameField.find('input[data-test="firstNameInput"]')
        expect(firstName.props().maxLength).toEqual(25)
    })

    test('first name should not use autoComplete', () => {
        const firstName = firstNameField.find('input[data-test="firstNameInput"]')
        expect(firstName.props().autoComplete).toEqual('off')
    })
})