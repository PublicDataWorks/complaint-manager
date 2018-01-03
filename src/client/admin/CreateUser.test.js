import React from 'react'
import CreateUser from './CreateUser'
import { mount, shallow } from 'enzyme'
import { expectEventuallyNotToExist } from '../../testHelpers'

describe('CreateUser', () => {
    test('should not display the dialog before the create user button is clicked', () => {
        let createUser = mount(<CreateUser/>)

        let dialogTitle = createUser.find('[data-test="createUserDialogTitle"]')

        expect(dialogTitle.exists()).toEqual(false)
    })

    test('should open up dialog when Add User button is clicked', () => {
        // Mount Component
        let createUser = mount(<CreateUser/>)

        // Find Button
        let addUserButton = createUser.find('button[data-test="createUserButton"]')

        // Click Button
        addUserButton.simulate('click')

        // Find Dialog
        let createUserDialog = createUser.find('[data-test="createUserDialogTitle"]')

        // Assert Dialog exists
        expect(createUserDialog.exists()).toEqual(true)
    })

    test('should dismiss when cancel button clicked', async () => {
        let createUser = mount(<CreateUser/>)

        // Find Button
        let addUserButton = createUser.find('button[data-test="createUserButton"]')

        // Click Button
        addUserButton.simulate('click')

        const cancelButton = createUser.find('button[data-test="cancelUser"]')
        cancelButton.simulate('click')

        await expectEventuallyNotToExist(createUser, '[data-test="createUserDialogTitle"]')

    })
})
