import React from 'react'
import {mount} from 'enzyme/build/index'
import CreationSnackbar from "./CreationSnackbar";
import {expectEventuallyNotToExist} from "../../testHelpers";

describe('CreationSnackbar', () => {
    test('should not be visible initially', () => {
        const creationSnackbar = mount(
            <CreationSnackbar
                open={false}
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
                open={false}
                creationSuccess={false}
                message={''}
            />
        )
        creationSnackbar.setProps({open: true, creationSuccess: true, message: 'successfully created.'})

        const resultMessage = creationSnackbar.find('span[data-test="creationSnackbarBannerText"]')

        expect(resultMessage.text()).toEqual('successfully created.')
    })

    test('should be not visible after dismissed', async () => {
        const creationSnackbar = mount(
            <CreationSnackbar
                open={true}
                creationSuccess={true}
                message={'successfully created.'}
            />
        )

        creationSnackbar.setProps({ open: false })

        await expectEventuallyNotToExist(
            creationSnackbar,
            '[data-test="creationSnackbarBannerText"]'
        )
    })
})