import React from 'react'
import {mount} from 'enzyme'
import NavBar from './NavBar'
import {Backdrop} from "material-ui";
import {BrowserRouter as Router} from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import {Provider} from "react-redux";
import {mockLocalStorage} from "../../mockLocalStorage";


describe('NavBar', () => {
    let wrapper, store
    beforeEach(() => {
        mockLocalStorage()

        store = createConfiguredStore()
        wrapper = mount(
            <Provider store={store}>
                <Router>
                    <NavBar/>
                </Router>
            </Provider>
        )
    });

    test('should contain a home icon button', () => {
        const homeButton = wrapper.find('[data-test="homeButton"]').last()

        homeButton.simulate('click')
        expect(homeButton.prop('href')).toEqual('/')
    })

    test('should contain a link named admin', () => {
        const gearButton = wrapper.find('button[data-test="gearButton"]')
        gearButton.simulate('click')

        const link = wrapper.find('a[data-test="ad' +
            'minButton"]')

        expect(link.prop('href')).toEqual('/admin')
    })

    test('should display default nickname', () => {
        const nickname = wrapper.find('[data-test="userNickName"]').last()
        expect(nickname.text()).toEqual('')

    })

    test('menu should be visible after gear icon click', () => {

        const gearButton = wrapper.find('button[data-test="gearButton"]')
        gearButton.simulate('click')

        const adminButton = wrapper.find('[data-test="adminButton"]')

        expect(adminButton.exists()).toBeTruthy()
    })

    test('should dismiss menu when clicking away', () => {
        const gearButton = wrapper.find('[data-test="gearButton"]').last()
        gearButton.simulate('click')

        const backdrop = wrapper.find(Backdrop)
        backdrop.simulate('click')

        const menu = wrapper.find(NavBar).find('[data-test="menu"]').first()

        expect(menu.props()).toHaveProperty('open', false)
    })
})