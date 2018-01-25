import React from 'react'
import {mount} from 'enzyme'
import CaseDashboard from './CaseDashboard'
import NavBar from '../sharedComponents/NavBar'
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {openCaseSnackbar} from "./actionCreators";
import createConfiguredStore from "../createConfiguredStore";

describe('CaseDashboard', () => {
    test('should display navbar with title', () => {
        const store = createConfiguredStore();
        const caseDashboard = mount(
            <Provider store={store}>
                <Router>
                    <CaseDashboard/>
                </Router>
            </Provider>
        )
        const navBar = caseDashboard.find(NavBar)
        expect(navBar.contains('View All Cases')).toEqual(true)
    })

    test('should close snackbar when mounted', () => {
        const store = createConfiguredStore();
        store.dispatch(openCaseSnackbar())

        mount(
            <Provider store={store}>
                <Router>
                    <CaseDashboard/>
                </Router>
            </Provider>
        )

        expect(store.getState()).toHaveProperty('cases.snackbar.open', false)
    })
})