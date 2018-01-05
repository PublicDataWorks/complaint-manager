import React from 'react'
import {  mount } from 'enzyme'
import NavBar from './NavBar'

describe('NavBar', () => {
    test('should contain a link named admin', () => {
        const nav = mount(<NavBar/>)
        const link = nav.find('a[data-test="adminLink"]')

        expect(link.text()).toEqual('Admin')
    })
})