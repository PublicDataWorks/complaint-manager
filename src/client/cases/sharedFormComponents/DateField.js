import React from "react"
import {Field} from "redux-form"
import {notFutureDate} from "../../formValidations"
import {TextField} from "redux-form-material-ui"
import moment from "moment"

const DateField = ({fieldProps, inputProps, style}) => {
    return(
        <Field
            {...fieldProps}
            component={TextField}
            inputProps={{
                ...inputProps,
                type: "date",
                max: moment(Date.now()).format('YYYY-MM-DD')
            }}
            style={style}
            InputLabelProps={{
                shrink: true,
            }}
            validate={[notFutureDate]}
        />
    )
}

export default DateField