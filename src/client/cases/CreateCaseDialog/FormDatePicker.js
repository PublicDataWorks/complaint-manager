import React from 'react'
import {DatePicker} from 'material-ui-pickers'
import {DateRange} from "material-ui-icons";

const FormDatePicker = (props) => {
    const {onBlur, ...withoutOnBlur} = props.input

    return (
        <DatePicker
            keyboard
            clearable
            disableFuture
            animateYearScrolling={false}
            keyboardIcon={<DateRange/>}
            {...withoutOnBlur}
            {...props}
        />
    )

}

export default FormDatePicker