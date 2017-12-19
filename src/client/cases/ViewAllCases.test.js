import React from 'react';
import {mount} from 'enzyme';
import { Provider } from 'react-redux'

import ViewAllCases from "./ViewAllCases";
import store from "../reduxStore"

describe('ViewAllCases component', () => {
    let viewAllCases;

    beforeEach(() => {
        viewAllCases = mount(
            <Provider store={store}>
                <ViewAllCases/>
            </Provider>
        );
    })

    test('should display title', () => {
        const pageTitle = viewAllCases.find('h2[data-test="pageTitle"]');
        expect(pageTitle.text()).toEqual('View All Cases')
    });

    test('should display modal to create case when button is clicked', () => {
        const createCaseButton = viewAllCases.find('button[data-test="createCaseButton"]')
        createCaseButton.simulate('click')

        const createCaseModalTitle = viewAllCases.find('[data-test="createCaseModalTitle"]')
        expect(createCaseModalTitle.text()).toEqual('Create New Case')
    });
});