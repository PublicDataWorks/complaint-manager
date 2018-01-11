import React from 'react'
import {mount} from 'enzyme/build/index'
import CreationSnackbar from "./CreationSnackbar";
import {expectEventuallyNotToExist} from "../../testHelpers";

describe('CaseCreationSnackbar', () => {
    test('should not be visible initially', () => {
        const creationSnackbar = mount(
            <CreationSnackbar
                inProgress={false}
                creationSuccess={false}
                message={''}
            />
        )

        const resultMessage = creationSnackbar.find('[data-test="creationSnackbarBannerText"]')
        expect(resultMessage.exists()).toEqual(false)
    })

    test('should be visible with success message after successful creation', () => {
        const creationSnackbar = mount(
            <CreationSnackbar
                inProgress={true}
                creationSuccess={false}
                message={''}
            />
        )

        creationSnackbar.setProps({inProgress: false, creationSuccess: true, message: 'successfully created.' })

        const resultMessage = creationSnackbar.find('[data-test="creationSnackbarBannerText"]')

        expect(resultMessage.text()).toEqual('successfully created.')
    })

    test('should dismiss snackbar', async () => {
        const creationSnackbar = mount(
            <CreationSnackbar
                inProgress={true}
                creationSuccess={false}
                message={''}
            />
        )

        creationSnackbar.setProps({inProgress: false, creationSuccess: true, message: 'successfully created.' })

        const dismissButton = creationSnackbar.find('button[data-test="closeSnackbar"]')
        dismissButton.simulate('click')

        await expectEventuallyNotToExist(
            creationSnackbar,
            '[data-test="creationSnackbarBannerText"]'
        )
    })
})