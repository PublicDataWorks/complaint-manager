import React from 'react';
import {mount} from "enzyme/build/index";
import {Provider} from 'react-redux';
import getCases from "./cases/thunks/getCases";
import {getCasesSuccess} from './cases/actionCreators';
import createConfiguredStore from "./createConfiguredStore";
import App from "./App";
import Case from "./testUtilities/case";

jest.mock("./cases/thunks/getCases", () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}));

describe('App component', () => {
    let table, cases, dispatchSpy;

    beforeEach(() => {
        const newCase = new Case.Builder().defaultCase().build();
        const newCase2 = new Case.Builder().defaultCase().withId(1).build();

        cases = [newCase, newCase2];

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
