import React from 'react'
import {mount} from 'enzyme'
import NavBar from './NavBar'
import {Backdrop} from "material-ui";
import {BrowserRouter as Router} from "react-router-dom";

describe('NavBar', () => {
    test('should contain a home icon button', () => {
        const wrapper = mount(
            <Router>
                <NavBar/>
            </Router>
        )
        const homeButton = wrapper.find('[data-test="homeButton"]').last()

        homeButton.simulate('click')
        expect(homeButton.prop('href')).toEqual('/')
    })

    test('should contain a link named admin', () => {
        const wrapper = mount(
            <Router>
                <NavBar/>
            </Router>
        )
        const gearButton = wrapper.find('button[data-test="gearButton"]')
        gearButton.simulate('click')

        const link = wrapper.find('a[data-test="ad' +
            'minButton"]')

        expect(link.prop('href')).toEqual('/admin')
    })

    test('menu should be visible after gear icon click', () => {
        const wrapper = mount(
            <Router>
                <NavBar/>
            </Router>
        )

        const gearButton = wrapper.find('button[data-test="gearButton"]')
        gearButton.simulate('click')

        const adminButton = wrapper.find('[data-test="adminButton"]')

        expect(adminButton.exists()).toBeTruthy()
    })

    test('should dismiss menu when clicking away', () => {
        const wrapper = mount(
            <Router>
                <NavBar/>
            </Router>
        )

        const gearButton = wrapper.find('button[data-test="gearButton"]')
        gearButton.simulate('click')

        const backdrop = wrapper.find(Backdrop)
        backdrop.simulate('click')

        const navBar = wrapper.find(NavBar).instance()

        expect(navBar.state).toHaveProperty('menuOpen', false)
    })
})