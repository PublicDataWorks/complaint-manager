import React from 'react'
import { Provider } from 'react-redux'
import store from "../reduxStore";
import {mount} from "enzyme/build/index";
import CaseCreationMessage from "./CaseCreationMessage";
import {createCaseSuccess, requestCaseCreation} from "./actionCreators";

describe('CaseCreationMessage', function () {
    let caseCreationMessage;

    beforeEach(() => {
        caseCreationMessage = mount(
            <Provider store={store}>
                <CaseCreationMessage/>
            </Provider>
        );
    })

    test('should be visible with success message after successful creation', () => {
        store.dispatch(requestCaseCreation())
        store.dispatch(createCaseSuccess({id: 1234}))
        caseCreationMessage.update()

        const resultMessage = caseCreationMessage.find('[data-test="createCaseBannerText"]')

        expect(resultMessage.text()).toEqual('Case 1234 was successfully created.')
    })
});