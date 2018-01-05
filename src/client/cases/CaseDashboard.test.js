import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux'
import CaseDashboard from "./CaseDashboard";
import store from "../reduxStore"

describe('CaseDashboard component', () => {
    let caseDashboard;

    beforeEach(() => {
        caseDashboard = mount(
            <Provider store={store}>
                <CaseDashboard/>
            </Provider>
        );
    })

    test('should display title', () => {
        const pageTitle = caseDashboard.find('h2[data-test="pageTitle"]');

        expect(pageTitle.text()).toEqual('View All Cases')
    })
})