import React from "react";
import {mount} from "enzyme";
import UserDashboard from "./UserDashboard";
import NavBar from "../sharedComponents/NavBar";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import {openSnackbar} from "../snackbar/actionCreators";

// NOTE: loading users on table mount crashes test runner
jest.mock('./thunks/getUsers', () => (userDetails) => ({
    type: 'MOCK_CREATE_USER_THUNK',
    userDetails
}))

describe('UserDashboard', () => {
    test('should display navbar with title', () => {
        const store = createConfiguredStore();
        const userDashboard = mount(
            <Provider store={store}>
                <Router>
                    <UserDashboard/>
                </Router>
            </Provider>
        )

        const navBar = userDashboard.find(NavBar)
        expect(navBar.contains('Manage Users')).toEqual(true)
    })

    test('should close snackbar when mounted', () => {
        const store = createConfiguredStore();
        store.dispatch(openSnackbar())

        mount(
            <Provider store={store}>
                <Router>
                    <UserDashboard/>
                </Router>
            </Provider>
        )

        expect(store.getState()).toHaveProperty('ui.snackbar.open', false)
    })
})