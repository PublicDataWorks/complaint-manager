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
                name='dateTest'
                label='TEST DATE FIELD LABEL'
                data-test='dateField'
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
        datePicker.simulate('blur')

        expect(datePickerField.text()).toContain('Date cannot be in the future')
    })

    test('should allow past date as input', () => {
        const yesterday = moment(Date.now()).subtract(1, 'days').format("YYYY-MM-DD")
        datePicker.simulate('change', {target: {value: yesterday}})
        datePicker.simulate('blur')

        expect(datePicker.instance().value).toEqual(yesterday)
    })

    test.skip('should reset date when invalid date is given and datefield clearable', () => {
       const ReduxFormWithClearableDateField = reduxForm({form: "testDateFormTwo"})(() => {
           return <DateField
               name='dateTest'
               label='TEST DATE FIELD LABEL'
               data-test='dateField'
               clearable={true}
               inputProps={{
                   'data-test':'dateInput'
               }}
           />
       })
        const store = createConfiguredStore()
        const anotherForm = mount(<Provider store={store}><ReduxFormWithClearableDateField/></Provider>)


        const input = form.find('[data-test="dateInput"]').last()
        const InputField = form.find('[data-test="dateField"]').first()

        // input.simulate('change', {target: {value: "2001-02-31"}})
        input.simulate('keydown', { preventDefault(){}, key: '2', keyCode: 90, which: 90 })

        input.simulate('blur')
        InputField.simulate('blur')
        anotherForm.update()

        console.log(input.instance().value)
    })

    test.skip('should not set date to an invalid date if not clearable', () => {
        const validDate = '2001-01-15'
        datePicker.simulate('change', {target: {value: validDate}})
        datePickerField.simulate('blur')

        expect(datePicker.instance().value).toEqual(validDate)

        const invalidDate = '2001-02-30'
        datePicker.simulate('change', {target: {value: invalidDate}})
        datePickerField.simulate('blur')
        form.update()

        console.log(datePicker.instance().value)

    })
});