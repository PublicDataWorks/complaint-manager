import React from 'react'
import {mount} from 'enzyme'
import CaseDashboard from './CaseDashboard'
import NavBar from '../sharedComponents/NavBar'
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import {openSnackbar} from "../snackbar/actionCreators";

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
        store.dispatch(openSnackbar())

        mount(
            <Provider store={store}>
                <Router>
                    <CaseDashboard/>
                </Router>
            </Provider>
        )

        expect(store.getState()).toHaveProperty('snackbar.open', false)
    })
})