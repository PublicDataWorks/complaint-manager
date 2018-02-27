import React from "react";
import moment from "moment/moment";
import DateField from "./DateField";
import {mount} from "enzyme";
import {reduxForm} from "redux-form";
import createConfiguredStore from "../../createConfiguredStore";
import {Provider} from "react-redux";

describe('DateField', () => {
    let ReduxDateField, form, datePicker, datePickerField
    beforeEach(() => {
        ReduxDateField = reduxForm({form: "testDateForm"})(() => {
            return <DateField
                fieldProps={{
                    name:'dateTest',
                    label:'TEST DATE FIELD LABEL',
                    'data-test':'dateField'
                }}
                inputProps={{
                    'data-test':'dateInput'
                }}
            />
        })

        const store = createConfiguredStore()
        form = mount(<Provider store={store}><ReduxDateField/></Provider>)


        datePicker = form.find('[data-test="dateInput"]').last()
        datePickerField = form.find('[data-test="dateField"]').first()
    });

    test('should display label', () => {
        expect(datePickerField.text()).toContain('TEST DATE FIELD LABEL')

    })

    test('should have a name', () => {
        expect(datePickerField.props()).toMatchObject({name: 'dateTest'})
    })

    test('should show validation error when input is a future date', () => {
        const tomorrow = moment(Date.now()).add(2, 'days').format("YYYY-MM-DD")
        datePicker.simulate('change', {target: {value: tomorrow}})
        datePickerField.simulate('blur')

        expect(datePickerField.text()).toContain('Date cannot be in the future')
    })

    test('should allow past date as input', () => {
        const yesterday = moment(Date.now()).subtract(1, 'days').format("YYYY-MM-DD")
        datePicker.simulate('change', {target: {value: yesterday}})
        datePickerField.simulate('blur')

        expect(datePicker.instance().value).toEqual(yesterday)
    })

    //TODO: find a way to test invalid date
});