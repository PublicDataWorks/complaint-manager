import React from 'react';
import {mount} from "enzyme/build/index";
import {Provider} from 'react-redux';
import getCases from "./cases/thunks/getCases";
import {getCasesSuccess} from './cases/actionCreators';
import createConfiguredStore from "./createConfiguredStore";
import App from "./App";

jest.mock("./cases/thunks/getCases", () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}));

describe('App component', () => {
    let table, cases, dispatchSpy;

    beforeEach(() => {
        cases = [{
            id: 17,
            civilians: [{
                id: 17,
                roleOnCase: 'Primary Complainant',
                firstName: 'Chuck',
                lastName: 'Berry',
                phoneNumber: 1234567890
            }],
            status: 'Initial',
            createdAt: new Date(2015, 8, 13).toISOString(),
            firstContactDate: "2017-12-25T00:00:00.000Z"

        }, {
            id: 24,
            civilians: [{
                id: 24,
                roleOnCase: 'Primary Complainant',
                firstName: 'Ariel',
                lastName: 'Pink',
                phoneNumber: 1234567890
            }],
            status: 'Initial',
            createdAt: new Date().toISOString(),
            firstContactDate: "2017-12-25T00:00:00.000Z"
        }];

        const store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch');
        store.dispatch(getCasesSuccess(cases));

        table = mount(
            <Provider store={store}>
                <App/>
            </Provider>
        )
    });

    test('should load all cases when mounted', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(getCases());
    })
});
