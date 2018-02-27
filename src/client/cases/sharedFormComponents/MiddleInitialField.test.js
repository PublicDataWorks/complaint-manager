import React from 'react'
import {changeInput, containsValue} from "../../../testHelpers";
import {reduxForm} from "redux-form";
import createConfiguredStore from "../../createConfiguredStore";
import MiddleInitialField from "./MiddleInitialField";
import {mount} from "enzyme";
import {Provider} from "react-redux";

describe('middle initial', () => {

    let ReduxForm, form, middleInitialInput
    beforeEach(() => {
        ReduxForm = reduxForm({form: "testForm"})(() => {
            return <MiddleInitialField name='middleInitialTest'/>
        })

        const store = createConfiguredStore()
        form = mount(<Provider store={store}><ReduxForm/></Provider>)


        middleInitialInput = form.find('[data-test="middleInitialInput"]').last()
    });

    test('should allow single alphabetical character', () => {
        changeInput(form, '[data-test="middleInitialInput"]', 'A')

        containsValue(form, '[data-test="middleInitialInput"]', 'A')
    })

    test('should replace non alphabetical character with previous input', () => {
        changeInput(form, '[data-test="middleInitialInput"]', 'A')
        changeInput(form, '[data-test="middleInitialInput"]', '1')

        containsValue(form, '[data-test="middleInitialInput"]', 'A')
    })

    test('should not allow multiple characters', () => {
        changeInput(form, '[data-test="middleInitialInput"]', 'A')
        changeInput(form, '[data-test="middleInitialInput"]', 'AA')

        containsValue(form, '[data-test="middleInitialInput"]', 'A')
    })

})