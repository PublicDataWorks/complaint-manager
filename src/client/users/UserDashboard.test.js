import React from "react";
import {mount} from "enzyme";
import UserDashboard from "./UserDashboard";
import NavBar from "../sharedComponents/NavBar";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import {openSnackbar} from "../snackbar/actionCreators";
import {mockLocalStorage} from "../../mockLocalStorage";

// NOTE: loading users on table mount crashes test runner
jest.mock('./thunks/getUsers', () => (userDetails) => ({
    type: 'MOCK_CREATE_USER_THUNK',
    userDetails
}))

describe('UserDashboard', () => {
    let store, userDashboard

    beforeEach(() => {
        mockLocalStorage()

        store = createConfiguredStore();
        store.dispatch(openSnackbar())

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

    test('should close snackbar when mounted', () => {
        expect(store.getState()).toHaveProperty('ui.snackbar.open', false)
    })
})