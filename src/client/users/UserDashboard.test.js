import React from "react";
import {mount} from "enzyme";
import UserDashboard from "./UserDashboard";
import NavBar from "../sharedComponents/NavBar";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {openUserSnackbar} from "./actionCreators";
import createConfiguredStore from "../createConfiguredStore";

// NOTE: loading users on table mount crashes test runner
jest.mock('./thunks/getUsers', () => (userDetails) => ({
    type: 'MOCK_CREATE_USER_THUNK',
    userDetails
}))

describe('UserDashboard', () => {
    let userDashboard, store

    beforeEach(() => {

        store = createConfiguredStore();
        userDashboard = mount(
            <Provider store={store}>
                <Router>
                    <UserDashboard/>
                </Router>
            </Provider>
        )
    })

    test('should display navbar with title', () => {
        const navBar = userDashboard.find(NavBar)
        expect(navBar.contains('Manage Users')).toEqual(true)
    })

    test('should close snackbar when unmounted', () => {
        store.dispatch(openUserSnackbar())

        userDashboard.unmount()

        expect(store.getState()).toHaveProperty('users.snackbar.open', false)
    })
})