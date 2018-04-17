import React from 'react'
import {mount} from 'enzyme'
import AddressInfoDisplay from "./AddressInfoDisplay";
import Address from "../testUtilities/Address";
import {containsText} from "../../testHelpers";

describe('AddressInfoDisplay', () => {
    test('should display Address Info', () => {
        const address = new Address.Builder().defaultAddress().withStreetAddress('200 E Randolph').withStreetAddress2('APT 2').build()
        const addressInfoWrapper = mount(
            <AddressInfoDisplay
                address={address}
                testLabel={'test'}
                label={'TEST LABEL'}
            />
        )

        containsText(addressInfoWrapper, '[data-test="test"]', '200 E Randolph')
        containsText(addressInfoWrapper, '[data-test="testAdditionalInfo"]', 'APT 2')
    })

    test('should display No Address Specified when no address is given', () => {
        const addressInfoWrapper = mount(
            <AddressInfoDisplay
                testLabel={'test'}
                label={'test address'}
            />
        )

        containsText(addressInfoWrapper, '[data-test="test"]', 'No address specified')
    })
});