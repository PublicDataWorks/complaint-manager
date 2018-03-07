import React from 'react'
import {Provider} from 'react-redux'
import createConfiguredStore from '../../createConfiguredStore'
import {mount} from 'enzyme'
import UsersTable from './UsersTable'
import {createUserSuccess} from "../../actionCreators/usersActionCreators";
import getUsers from '../thunks/getUsers'

jest.mock('../thunks/getUsers', () => () => ({
    type: 'MOCK_GET_USERS_THUNK'
}))

describe('users table', () => {
    let table, userRow, dispatchSpy, newUser, anotherUser, store

    beforeEach(() => {
        newUser = {
            id: 100,
            firstName: 'Fachtna',
            lastName: 'Bogdan',
            email: 'fbogdan@gmail.com',
            createdAt: new Date(2015, 7, 25).toISOString()
        }

        anotherUser = {
            id: 101,
            firstName: "Mauritius",
            lastName: "Stanko",
            email: "mstanko@gmail.com",
            createdAt: new Date(2015, 7, 25).toISOString()
        }

        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')
        store.dispatch(createUserSuccess(newUser))
        store.dispatch(createUserSuccess(anotherUser))

        table = mount(
            <Provider store={store}>
                <UsersTable/>
            </Provider>
        )

        userRow = table.find('tr[data-test="userRow100"]')
    })

    test('should display name', () => {
        const name = userRow.find('td[data-test="userName"]')

        expect(name.text()).toEqual('Fachtna Bogdan')
    })

    test('should display email', () => {
        const email = userRow.find('td[data-test="userEmail"]')

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

    test('should display users in alphabetical order', () => {
        const rows = table.find('TableBody').find('TableRow')

        const firstRow = rows.at(0)
        const secondRow = rows.at(1)

        expect(firstRow.find('TableCell').at(0).text()).toEqual(`${newUser.firstName} ${newUser.lastName}`)
        expect(secondRow.find('TableCell').at(0).text()).toEqual(`${anotherUser.firstName} ${anotherUser.lastName}`)
    })

    test('users remain in alphabetical order after create', () => {
        const yetAnotherUser = {
            id: 500,
            firstName: 'Talin',
            lastName: 'Guus',
            email: 'tguus@gmail.com',
            createdAt: new Date(2016, 7, 25).toISOString()
        }

        store.dispatch(createUserSuccess(yetAnotherUser))
        table.update()

        const rows = table.find('TableBody').find('TableRow')

        const secondRow = rows.at(1)

        expect(secondRow.find('TableCell').at(0).text()).toEqual(`${yetAnotherUser.firstName} ${yetAnotherUser.lastName}`)
    })
})
