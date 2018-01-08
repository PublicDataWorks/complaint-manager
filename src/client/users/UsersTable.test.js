import React from 'react'
import {Provider} from 'react-redux'
import store from '../reduxStore'
import {mount} from 'enzyme'
import UsersTable from './UsersTable'
import {createUserSuccess} from "./actionCreators";
import getUsers from './thunks/getUsers'

jest.mock('./thunks/getUsers', () => () => ({
    type: 'MOCK_GET_USERS_THUNK'
}))

describe('users table', () => {
    let table, userRow, dispatchSpy

    const newUser = {
        id: 100,
        firstName: 'Fachtna',
        lastName: 'Bogdan',
        email: 'fbogdan@gmail.com',
        createdAt: new Date(2015, 7, 25).toISOString()
    }

    const anotherUser = {
        id: 101,
        firstName: "Mauritius",
        lastName: "Stanko",
        email: "mstanko@gmail.com",
        createdAt: new Date(2015, 7, 25).toISOString()
    }

    store.dispatch(createUserSuccess(newUser))
    store.dispatch(createUserSuccess(anotherUser))

    beforeEach(() => {
        dispatchSpy = jest.spyOn(store, 'dispatch')

        table = mount(
            <Provider store={store}>
                <UsersTable/>
            </Provider>
        )

        userRow = table.find('tr[data-test="userRow100"]')
    })

    test('should display name', () => {
        const name = userRow.find('[data-test="userName"]')

        expect(name.text()).toEqual('Fachtna Bogdan')
    })

    test('should display email', () => {
        const email = userRow.find('[data-test="userEmail"]')

        expect(email.text()).toEqual('fbogdan@gmail.com')
    })

    test('should display date added', () => {
        const dateAdded = userRow.find('td[data-test="userDateAdded"]')

        expect(dateAdded.text()).toEqual('Aug 25, 2015')
    })

    test('should display multiple users', () => {
        const anotherUserRow = table.find('tr[data-test="userRow101"]')

        expect(anotherUserRow.exists()).toEqual(true)
    })

    test('should get all users when mounted', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(getUsers())
    })
})
