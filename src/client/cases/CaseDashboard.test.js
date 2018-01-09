import React from 'react'
import { shallow } from 'enzyme'
import CaseDashboard from './CaseDashboard'
import NavBar from '../NavBar'

describe('CaseDashboard component', () => {
    let caseDashboard

    beforeEach(() => {
        caseDashboard = shallow(
            <CaseDashboard/>
        )
    })

    test('should display navbar with title', () => {
        const navBar = caseDashboard.find(NavBar)
        expect(navBar.contains('View All Cases')).toEqual(true)
    })
})