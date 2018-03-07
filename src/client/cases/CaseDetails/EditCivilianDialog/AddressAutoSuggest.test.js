import {mount} from "enzyme";
import AddressAutoSuggest from "./AddressAutoSuggest";
import React from "react";
import {changeInput, containsText} from "../../../../testHelpers";
import {Provider} from 'react-redux';
import createConfiguredStore from "../../../createConfiguredStore";


describe('AddressAutoSuggest', () => {
    let store
    beforeEach(() => {
        store = createConfiguredStore()
    })

    test('should display a label', () => {
        let autoSuggestWrapper, label
        label = 'Test Label'
        autoSuggestWrapper = mount(
            <Provider store={store}>
                <AddressAutoSuggest
                    label={label}
                    inputProps={{
                        'data-test': 'my-custom-autosuggest'
                    }}
                />
            </Provider>
        )

        containsText(autoSuggestWrapper, '[data-test="my-custom-autosuggest"]', label)
    })

    describe('Cant test at unit level, move to nightwatch test', () => {

        test.skip('should display suggestions when text is entered', () => {
            let cannedSuggestions = ['123 main street', 'Chicago, IL', 'Burma']
            const suggestionEngine = {

                //returns suggestion value for updating input value
                getSuggestionValue: jest.fn( () => (suggestion) => {
                    return suggestion
                }),

                //fetches suggestions if need be, call calback with results
                onFetchSuggestions: jest.fn(()=> (input, callback) => {
                    callback(cannedSuggestions)
                }),

                //after selecting a suggestion, what else should be done?
                onSuggestionSelected: jest.fn(()=>(suggestion) => {
                    return suggestion
                })
            }

            const autoSuggestWrapper = mount(
                <Provider store={store}>
                    <AddressAutoSuggest
                        suggestionEngine={suggestionEngine}
                        inputProps={{
                            'data-test': 'my-custom-autosuggest'
                        }}
                    />
                </Provider>
            )

            expect(autoSuggestWrapper.find('[data-test="my-custom-autosuggest"]').exists()).toBeTruthy()
            changeInput(autoSuggestWrapper, '[data-test="my-custom-autosuggest"]', "asasfd")
            console.log(autoSuggestWrapper
                .find('[data-test="suggestion-container"]')
                .last()
                .debug()
            )

        })
        test.skip('should not select suggestion when navigating through them', () => {

        })
        test.skip('should select suggestion on enter/click', () => {

        })
    });

});