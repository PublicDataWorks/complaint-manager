import React from 'react'
import {shallow} from "enzyme";
import {OfficerSearchResults} from './OfficerSearchResults'

describe('OfficerSearchResults', () => {
    describe("spinner", () => {
        test('should display spinner when spinnerVisible is true', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={true} searchResults={[]}/>)
            const spinner = wrapper.find("[data-test='spinner']")
            expect(spinner.exists()).toEqual(true)
        })
        test('should not display spinner when spinnerVisible is false', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={false} searchResults={[]}/>)
            const spinner = wrapper.find("[data-test='spinner']")
            expect(spinner.exists()).toEqual(false)
        })
    })
    describe("no search results message", () => {
        test('should display no search results message when searchResults are empty and spinner is not visible', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={false} searchResults={[]}/>);
            const noSearchResultsMessage = wrapper.find("[data-test='noSearchResultsMessage']");
            expect(noSearchResultsMessage.exists()).toEqual(true)
        });
        test('should not display no search results message when searchResults are empty and spinner is visible', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={true} searchResults={[]}/>);
            const noSearchResultsMessage = wrapper.find("[data-test='noSearchResultsMessage']");
            expect(noSearchResultsMessage.exists()).toEqual(false)
        });
        test('should not display no search results message when searchResults are present and spinner is not visible', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={false} classes={{}} searchResults={[{firstName: 'bob', id: 1}]}/>);
            const noSearchResultsMessage = wrapper.find("[data-test='noSearchResultsMessage']");
            expect(noSearchResultsMessage.exists()).toEqual(false)
        });
    });
});