import React from 'react';
import {shallow, mount} from 'enzyme';
import ViewAllCases from "./ViewAllCases";

describe('ViewAllCases component', () => {
    test('should display title', () => {
        const viewAllCases = shallow(
            <ViewAllCases/>
        );

        const heading = viewAllCases.find('AppBar');

        expect(heading.props().title).toContain('View All Cases')
    });

    test('should display modal to create case when button is clicked', () => {
        const viewAllCases = shallow(<ViewAllCases/>)

        viewAllCases.find('[data-test="createCaseButton"]').simulate('click')

        expect(viewAllCases.find('Dialog').props().open).toBeTruthy()
    });
});