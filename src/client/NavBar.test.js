import React from 'react'
import { shallow } from 'enzyme'
import NavBar from './NavBar'

describe('NavBar', () => {
    test('should contain a link named admin', () => {
        const nav = shallow(<NavBar/>)
        const link = nav.find('a[data-test="adminLink"]')

        expect(link.text()).toEqual('Admin')
    })
})