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
    describe("search results message", () => {
        test('should not display search results message when searchResults are empty and spinner is not visible', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={false} searchResults={[]}/>);
            const searchResultsMessage = wrapper.find("[data-test='searchResultsMessage']");
            expect(searchResultsMessage.exists()).toEqual(true)
        });
        test('should not display search results message when searchResults are empty and spinner is visible', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={true} searchResults={[]}/>);
            const searchResultsMessage = wrapper.find("[data-test='searchResultsMessage']");
            expect(searchResultsMessage.exists()).toEqual(false)
        });
        test('should display number of search results when single result is present and spinner is not visible', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={false} classes={{}}
                                                          searchResults={[{firstName: 'bob', id: 1}]}/>);
            expect(wrapper.find("[data-test='searchResultsMessage']").children().text()).toEqual("1 result found");
        })
        test('should display number of search results when searchResults are present and spinner is not visible', () => {
            const wrapper = shallow(<OfficerSearchResults spinnerVisible={false} classes={{}}
                                                          searchResults={[{firstName: 'bob', id: 1}, {firstName: 'joan', id: 2}]}/>);
            expect(wrapper.find("[data-test='searchResultsMessage']").children().text()).toEqual("2 results found");
        })
    });
});