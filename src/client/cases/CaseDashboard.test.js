import React from 'react'
import {mount} from 'enzyme'
import CaseDashboard from './CaseDashboard'
import NavBar from '../sharedComponents/NavBar'
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import {openSnackbar} from "../actionCreators/snackBarActionCreators";
import {mockLocalStorage} from "../../mockLocalStorage";
import {getCasesSuccess} from "../actionCreators/casesActionCreators";
import Case from "../testUtilities/case";
import getCases from "./thunks/getCases";

jest.mock("./thunks/getCases", () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}));

describe('CaseDashboard', () => {
    let caseDashboard, store, dispatchSpy, cases

    beforeEach(() => {
        mockLocalStorage()

        const newCase = new Case.Builder().defaultCase().build();
        const newCase2 = new Case.Builder().defaultCase().withId(1).build();
        cases = [newCase, newCase2];

        store = createConfiguredStore();
        store.dispatch(getCasesSuccess(cases));
        store.dispatch(openSnackbar())

        dispatchSpy = jest.spyOn(store, 'dispatch');

        caseDashboard = mount(
            <Provider store={store}>
                <Router>
                    <CaseDashboard/>
                </Router>
            </Provider>
        )
    })

    test('should display navbar with title', () => {
        const navBar = caseDashboard.find(NavBar)
        expect(navBar.contains('View All Cases')).toEqual(true)
    })

    test('should load all cases when mounted', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(getCases());
    })

    test('should close snackbar when mounted', () => {
        expect(store.getState()).toHaveProperty('ui.snackbar.open', false)
    })
})