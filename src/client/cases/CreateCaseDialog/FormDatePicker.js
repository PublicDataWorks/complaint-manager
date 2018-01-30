import React from 'react'
import {DatePicker} from 'material-ui-pickers'
import {DateRange} from "material-ui-icons";
import formatDate from "../../formatDate";

const labelFunc = (date, invalidLabel) =>{
    if (date === null) {
        return '';
    }

    return date && date.isValid() ?
        formatDate(date)
        :
        invalidLabel;
}

const FormDatePicker = (props) => {
    const {onBlur, ...withoutOnBlur} = props.input

    return (
        <DatePicker
            keyboard
            disableFuture
            animateYearScrolling={false}
            labelFunc={labelFunc}
            keyboardIcon={<DateRange/>}
            {...withoutOnBlur}
            {...props}
        />
    )

}

export default FormDatePicker