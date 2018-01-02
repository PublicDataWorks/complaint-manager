import React from 'react';
import {mount} from 'enzyme';
import { Provider } from 'react-redux'
import ViewAllCases from "./ViewAllCases";
import store from "../reduxStore"
import {createCase, createCaseSuccess} from './actionCreators'

describe('ViewAllCases component', () => {
    let viewAllCases;

    beforeEach(() => {
        viewAllCases = mount(
            <Provider store={store}>
                <ViewAllCases/>
            </Provider>
        );
    })

    test('should display title', () => {
        const pageTitle = viewAllCases.find('h2[data-test="pageTitle"]');
        expect(pageTitle.text()).toEqual('View All Cases')
    });

    test.skip('banner is visible with success message when case creation is successful', () => {
      const responseBody = {
        id: 1234,
        firstName: 'Fats',
        lastName: 'Domino',
        status: 'Initial',
      }

      const action = createCaseSuccess(responseBody)
      store.dispatch(action)

      expect(viewAllCases.props().caseCreationResult).toEqual({type:'SUCCESS', message: 'Case 1234 was successfully created'})
      // const banner = viewAllCases.find('[data-test="createCaseBannerText"]')
      // expect(banner.text()).toEqual('Case 1234 was successfully created')

    })

    // setup state in tests by dispatching actions
    // example:
    // store.dispatch(caseCreationFailure())
    // then mount the component and assert that failure banner is visible
});