import React from 'react'
import {mount} from 'enzyme'
import IncidentDetails from "./IncidentDetails"

describe('incident details', () => {
    let wrapper
    beforeEach(() => {
        const props = {
            firstContactDate: '04/24/1994',
            incidentDate: '03/25/1993',
            incidentTime: '4:30 AM'
        }
        wrapper = mount(
            <IncidentDetails
                firstContactDate={props.firstContactDate}
                incidentDate={props.incidentDate}
                incidentTime={props.incidentTime}
            />
        )
    });

    test('should display first contact date', () => {
        expect(wrapper.find('[data-test="firstContactDate"]').exists()).toEqual(true)
        expect(wrapper.find('[data-test="firstContactDate"]').first().text()).toEqual('Apr 24, 1994')
    })

    test('should display incident Date', () => {
        expect(wrapper.find('[data-test="incidentDate"]').exists()).toEqual(true)
        expect(wrapper.find('[data-test="incidentDate"]').first().text()).toEqual('Mar 25, 1993')
    })

    test('should display incident time', () => {
        expect(wrapper.find('[data-test="incidentTime"]').exists()).toEqual(true)
        expect(wrapper.find('[data-test="incidentTime"]').first().text()).toEqual('4:30 AM')
    })
});